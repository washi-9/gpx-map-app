import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DataDisplay from './components/DataDisplay';

function App() {
    // 仮のデータを定義
    const [serverDataList, setServerDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (e) => {
        e.preventDefault();

        // フォームからファイルを取得
        const fileInput = e.target.elements.fileInput;
        if (!fileInput.files.length) {
            alert("ファイルを選択してください");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        // index.tsでupload.single('file')と指定されているため、キー名は'file'とする
        formData.append('file', file);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('ファイルのアップロードに失敗しました');
            }

            const result = await response.json();

            console.log("サーバーからの応答:", result);

            setServerDataList(prevList => [...prevList, result]);
        
        } catch (error) {
            console.error("Error:", error);
            alert("エラーが発生しました: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="App" style={{ padding: '20px'}}>
            <h1>GPX ファイル解析 & マップ表示</h1>

            <form onSubmit={handleFileUpload} style={{ marginBottom: '20px' }}>
                <input 
                    type="file" 
                    name="fileInput"
                    accept=".gpx" // GPXファイルのみ許可
                    style={{ marginRight: '10px' }}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "解析中..." : "アップロード & 解析"}
                </button>
            </form>

            <div style={{ display: 'flex', gap: '20px' }}>
              {/* 左側:解析結果の文字表示 */}
              <div style={{ flex: '1', color: '#333' }}>
                {serverDataList.map((data, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <DataDisplay data={data.stats} />
                </div>
              ))}
              </div>

              {/* 右側:地図表示 */}
              <div style={{ flex: '2', height: '500px', border: '1px solid #ccc' }}>
                <MapContainer
                  center={[35.681236, 139.767125]} // 東京駅の座標
                  zoom={6}
                  style={{ height: '100%', width: '200%' }}
                  >
                    <TileLayer
                      attribution='&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* サーバーからデータが届いたら地図上に描画 */}
                        {serverDataList.map((data, index) => (
                            <GeoJSON
                                key={data.stats.filename + index}
                                data={data.data}
                                style={{ color: 'blue', weight: 4 }}
                            />
                        ))}
                </MapContainer>
              </div>
            </div>
        </div>
    )
}

export default App;