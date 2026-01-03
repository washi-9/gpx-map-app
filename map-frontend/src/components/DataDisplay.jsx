import React from 'react';

const DataDisplay = ({ data }) => {
    // データが空の場合は何も表示しない
    if (!data) return null;

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
            <h2>解析結果</h2>
            <ul>
                <li><strong>ファイル名:</strong> {data.filename}</li>
                <li><strong>総距離:</strong> {data.distanceKm} km</li>
            </ul>
        </div>
    );
}

export default DataDisplay;