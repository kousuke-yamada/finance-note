import { Grid, Paper } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import MonthSelector from "../components/MonthSelector";
import CategoryChart from "../components/CategoryChart";
import TransactionTable from "../components/TransactionTable";
import BarChart from "../components/BarChart";
import { Transaction } from "../types";

/**
 * Reportコンポーネントの Props 型定義
 * @property {Date} currentMonth - 現在表示している月
 * @property {Dispatch<SetStateAction<Date>>} setCurrentMonth - 現在表示している月のステート更新関数
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {boolean} isLoading - 収支情報のローディング状態
 * @property {(
    transactionId: string | readonly string[]
  ) => Promise<void>} onDeleteTransaction - 選択中の取引カードの収支データをFirebaseから削除する非同期関数
 */
interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
}

/******************************************************
 * Report Component
 *
 * @description Reportページを表示するコンポーネント
 ******************************************************/
const Report = ({
  currentMonth,
  setCurrentMonth,
  monthlyTransactions,
  isLoading,
  onDeleteTransaction,
}: ReportProps) => {
  /** グラフの共通背景スタイル定義*/
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        {/* 日付選択エリア */}
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={commonPaperStyle}>
          {/* 円グラフ */}
          <CategoryChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={commonPaperStyle}>
          {/* 棒グラフ */}
          <BarChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        {/* テーブル */}
        <TransactionTable
          monthlyTransactions={monthlyTransactions}
          onDeleteTransaction={onDeleteTransaction}
        />
      </Grid>
    </Grid>
  );
};

export default Report;
