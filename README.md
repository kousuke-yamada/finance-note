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

## 使用技術

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
  
---


## 技術選定について

機能性・拡張性・保守性を重視し、開発効率や運用しやすさ、表現力の高さを総合的に判断して選定した。

### 技術選定の方針

- 開発効率：スムーズな開発とリリースを実現すること  
- 保守性と拡張性：将来的な機能追加や設計変更に柔軟に対応可能であること  
- パフォーマンス：ユーザーが快適に操作できること  
- 表現力：意図したUI/UXを実現できる自由度の高さ  
- 構成の明快さ：誰が見ても理解しやすいアーキテクチャであること

### 採用理由

- **React 18 + TypeScript**  
  柔軟かつ堅牢なUI設計とコードの安定性を両立。

- **Firebase (Firestore + Authentication)**  
  サーバーレスで認証・データ管理を簡単に実装。スケーラブルで運用負荷が低い。

- **Vite**  
  高速ビルドとホットリロードで快適な開発環境。

- **GitHub Actions + Vercel**  
  CI/CD自動化と高速デプロイでリリースを円滑化。

- **Material UI (MUI)**  
  豊富なコンポーネントで統一感あるUIを効率的に構築。

- **その他ライブラリ**  
  FullCalendar、date-fns、Chart.js、Zod は、それぞれ用途に特化した安定性の高いライブラリであり、導入コストと機能性のバランスに優れている。

### 技術構成の意図

- React + TypeScript + MUI による堅牢なフロントエンド設計と効率的な開発  
- Firebase + Vercel によるシンプルかつスケーラブルなインフラ構成  
- Vite + GitHub Actions で高速な開発サイクルと管理のしやすさを実現  

### リスクと対応

| 想定リスク                | 対応策                                                     |
|---------------------------|--------------------------------------------------------------|
| Firebase依存のリスク      | Firebaseの特徴を理解し利用、柔軟な設計を心がけ将来の対応を検討 |
| MUIアップデートの影響    | バージョン管理とカスタムテーマで影響範囲を限定               |
| Vercelコスト増加の懸念   | アクセス状況をモニタリングし必要に応じて調整を検討             |

### 期待される効果

- 安定した動作と保守しやすいコード構成  
- 優れたユーザー体験を実現する高性能なUI  
- 開発・運用コストの削減と効率化  


---


## セキュリティ設定
### Firebase設定値の管理
以下の理由により、Firebase設定値（apiKey等）はハードコーディングとしている。
1. **Firebase設計の特性**
   - これらの値はGoogleの設計上、クライアントサイドで公開されることが前提
   - apiKeyは認証キーではなく、プロジェクト識別子としての役割
2. **ポートフォリオ用途での利便性**
   - 閲覧者が`git clone`後、環境変数設定なしで即座に動作確認可能
   - デモアプリとしてのaccessibilityを優先
3. **セキュリティ制御の実装**
   - 実際のセキュリティ制御はFirebase Security Rulesで実装

### Firestore Security Rules
Firestore では Security Rules によるアクセス制御を実装しており、認証状態やユーザーIDに応じた適切な制限を設けている。これにより、未認証ユーザーによる不正操作や、他ユーザーのデータへのアクセスを防止する。  
本番環境では、以下のSecurity Rulesを設定する。
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // 通常ユーザー：認証済みで自分のデータのみ
      // ゲストユーザー：userIdが"guest"の場合のみ未認証でも許可
      allow read, write: if (request.auth != null && request.auth.uid == userId) || (userId == "guest");
      
      match /Transactions/{transactionId} {
        allow read, write: if (request.auth != null && request.auth.uid == userId) || (userId == "guest");
      }
    }
  }
}
```

### Firebase認証エラーの共通処理
認証処理で発生しうる各種エラーを整理・分類し、適切にハンドリングする。

**主な特徴**
- Firebaseの認証エラーコードを enum で定義
- 各エラーに対して日本語メッセージを表示
- 認証方式の制限やネットワークエラーにも対応

**対応エラー例**
- ユーザー未登録、パスワードの誤り
- メールアドレスの重複、無効な形式
- ポップアップブロック、ネットワーク障害
