/** 収支タイプ（収入・支出）の型定義 */
export type TransactionType = "income" | "expense";

/** 収入カテゴリの型定義 */
export type IncomeCategory = "給与" | "副収入" | "お小遣い";

/** 支出カテゴリの型定義 */
export type ExpenseCategory =
  | "食費"
  | "日用品"
  | "住居費"
  | "交際費"
  | "娯楽"
  | "交通費";

/**
 * 収支データの型定義
 * @property {string} id - 収支データID
 * @property {string} date - 日付
 * @property {number} amount - 金額
 * @property {string} content - 収支の内容
 * @property {TransactionType} type - 収支タイプ
 * @property {IncomeCategory | ExpenseCategory} category - 収支カテゴリ
 */
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  content: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
}

/**
 * 収支表示フォーマットの型定義
 * @property {string} income - 収入
 * @property {string} expense - 支出
 * @property {number} balance - 残高
 */
export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

/**
 * FullCalendarイベント表示用の型定義
 * @property {string} start -
 * @property {string} income - 支出
 * @property {string} expense - 残高
 * @property {string} balance - 残高
 */
export interface CalendarContent {
  start: string;
  income: string;
  expense: string;
  balance: string;
}

/** 認証プロバイダの型定義 */
export type ProviderType = "email" | "google";

/**
 * ログインユーザー情報の型定義
 * @property {string} uid - ユーザーID
 * @property {string | null} displayName - 表示名
 * @property {string | null} email - 登録メールアドレス
 * @property {ProviderType} provider - 認証プロバイダ
 * @property {string | null} photoURL - プロフィール画像
 * @property {any} createAt - アカウント作成日時
 * @property {any} lastLoginAt - 最終ログイン日時
 */
export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  provider: ProviderType;
  photoURL: string | null;
  createAt: any;
  lastLoginAt: any;
}
