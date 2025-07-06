import { format } from "date-fns";

/** 年月表示フォーマット変換処理
 * Date型の日付情報を　"2025-01"の形式にして返す。
 */
export function formatMonth(date: Date): string {
  return format(date, "yyyy-MM");
}

/** 日本円に変換する処理
 *. 入力された金額を「1,000」のようにカンマ区切りの表記に変換して返す
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP");
}
