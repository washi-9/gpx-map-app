# GPX Map Visualize
GPXファイルをアップロードし、地図上で複数のルートを可視化・距離解析するWebアプリケーションです。

## 概要
このプロジェクトは、サイクリングやランニングの記録（GPXデータ）を一本の「線」として地図上につなげ、可視化することを目的としています。複数のファイルを連続してアップロードすることで、蓄積された移動データを一度に確認できます。

## 主な機能
GPXファイルの解析: アップロードされたGPXファイルから総走行距離を自動計算。

- マルチマップ表示: 複数のルートを地図上に同時に描画。
- レスポンシブなデータ表示: 解析された統計情報（ファイル名、距離）をリスト形式で表示。

## 技術スタック
### Frontend
- React (Vite)
- React-Leaflet (地図描画ライブラリ)
- Leaflet

### Backend
- Node.js / Express
- TypeScript (ts-node)
- Multer (ファイルアップロード処理)
- Turf.js (地理空間解析)
- togeojson (GPXからGeoJSONへの変換)

## セットアップと実行方法
1. リポジトリのクローン

``` bash
git clone https://github.com/washi-9/gpx-map-app.git
cd gpx-map-app
```

2. バックエンドの起動
```bash
cd map-backend
npm install
npx ts-node index.ts
```
※ サーバーは http://localhost:3001 で起動します。

3. フロントエンドの起動
``` bash
cd ../map-frontend
npm install
npm run dev
```
※ ブラウザで http://localhost:5173 を開いてください。

## 今後の実装予定
- UI/UXの改善
- ルートの保存
- ルートの編集・削除機能
- ユーザー認証機能
