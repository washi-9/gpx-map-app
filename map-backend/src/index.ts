import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { DOMParser } from "xmldom";
import { gpx } from '@tmcw/togeojson';
import * as turf from '@turf/turf';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @ts-ignore: expressの型定義の微細な不一致を無視
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const gpxString = req.file.buffer.toString('utf-8');
        const parser = new DOMParser();
        const gpxDom = parser.parseFromString(gpxString, 'text/xml');

        const geoJson = gpx(gpxDom);

        const distance = turf.length(geoJson, { units: 'kilometers' });

        res.json({
            message: '解析成功',
            stats: {
                distanceKm: Math.round(distance * 100) / 100,
                filename: req.file.originalname
            },
            data: geoJson // 地図表示用の生データ
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ファイルの解析中にエラーが発生しました' });
    }
});

app.get('/', (req, res) => {
    res.send('GPX Server is running!');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});