import { Balance, Transaction } from "../types";

/** 収支データの計算処理
 * 入力された収支データを以下の形式にして返す。
 * {income: 1000,expense: 700, balance: 300 }
 */
export function financeCalculations(transactions: Transaction[]): Balance {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type == "income") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      acc.balance = acc.income - acc.expense;

      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

/** 日毎収支の計算処理
 * 入力された収支データを以下形式にして返す。日付に収支を紐づける。
 * ["2025-01-01"] = {income: 1000,expense: 700, balance: 300 }
 */
export function calculateDailyBalances(
  transactions: Transaction[]
): Record<string, Balance> {
  return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
    const day = transaction.date;

    if (!acc[day]) {
      acc[day] = { income: 0, expense: 0, balance: 0 };
    }

    if (transaction.type === "income") {
      acc[day].income += transaction.amount;
    } else {
      acc[day].expense += transaction.amount;
    }
    acc[day].balance = acc[day].income - acc[day].expense;

    return acc;
  }, {});
}
