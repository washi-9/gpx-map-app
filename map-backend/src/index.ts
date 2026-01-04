import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { DOMParser } from "xmldom";
import { gpx } from '@tmcw/togeojson';
import * as turf from '@turf/turf';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        console.log("送信するファイルリスト:",files); // debug
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'ファイル一覧の取得失敗'});
    }
});

app.get('/api/parse/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        console.log("解析リスト:",filename); // debug
        const filePath = path.join(uploadDir, filename);
        const gpxString = fs.readFileSync(filePath, 'utf-8');

        const parser = new DOMParser();
        const gpxDom = parser.parseFromString(gpxString, 'text/xml');
        const geoJson = gpx(gpxDom);
        const distance = turf.length(geoJson, { units: 'kilometers' });

        res.json({
            stats: {
                distanceKm: Math.round(distance * 100) / 100,
                filename: filename.split('-').slice(1).join('-'), // 元のファイル名を取得
                serverFileName: filename
            },
            data: geoJson
        });
    } catch (error) {
        res.status(500).json({ error: '解析失敗' });
    }
});

// @ts-ignore: expressの型定義の微細な不一致を無視
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const gpxString = fs.readFileSync(req.file.path, 'utf-8');
        const parser = new DOMParser();
        const gpxDom = parser.parseFromString(gpxString, 'text/xml');
        const geoJson = gpx(gpxDom);
        const distance = turf.length(geoJson, { units: 'kilometers' });

        res.json({
            stats: {
                distanceKm: Math.round(distance * 100) / 100,
                filename: req.file.originalname,
                serverFileName: req.file.filename
            },
            data: geoJson // 地図表示用の生データ
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '解析失敗' });
    }
});

app.get('/', (req, res) => {
    res.send('GPX Server is running!');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});