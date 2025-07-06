# Finance-Note
### 汎用的な家計簿アプリ。シンプルなUIで、日々の収入・支出を気軽に記録できる。
- ゲストモード
  - お試し用。ユーザー登録を行わずに、自由に画面を操作しながら、アプリの使い心地を確認できる。但し、ゲストモードは共有環境となっており、 入力されたデータは他のゲストユーザーと共有される、サンプル用のデータとして扱われる。
- メンバーモード
  - 個人記録用。アカウント作成し、ログインすることで、個人のアカウントに紐づいた収支データを記録・管理できるようになる。他のユーザーとは完全に分離された、自分専用の家計簿として活用できる。
  
サービスURL：https://finance-note-base.vercel.app/

仕様書： [【仕様書】Finance_Note アプリ開発](https://docs.google.com/spreadsheets/d/1_tU3pyckgYj02N8q94A0vuPmPDS3GhBOqm8eTNHitaQ/edit?gid=0#gid=0)

---

#### ▪️Home画面
<img width="1434" alt="スクリーンショット 2025-07-07 2 51 28" src="https://github.com/user-attachments/assets/1121c5cd-2665-462c-8728-17a65b1c52fb" />

---

#### ▪️Report画面
<img width="1432" alt="スクリーンショット 2025-07-07 2 51 41" src="https://github.com/user-attachments/assets/7b05914a-56c3-4d32-85f3-9fbd5f5a5621" />

---

### 使用技術

| カテゴリ | 技術 |
|------|------|
| フロントエンド | React 18.2.0 / Typescript  5.8.3   | 
| バックエンド | なし   | 
| データベース | FireStore Database   | 
| 認証 | Firebase Authentication   |
| ビルドツール | Vite   | 
| CI/CD | Github Actions   | 
| ホスティング | Vercel   | 
| UIライブラリ | Material UI   |
| 日付・カレンダー | FullCalendar / date-fns / DatePicker   |
| グラフ描画 |  Chart.js   | 
| バリデーション |  Zod   | 
