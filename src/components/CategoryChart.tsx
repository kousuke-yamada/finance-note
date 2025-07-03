import { ChangeEvent, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType,
} from "../types";
import { theme } from "../theme/theme";

/**
 * Chart.js用コンポーネント登録
 * 円グラフ(<Pie>コンポーネント)描画に必要な要素をグローバルレジストリに事前登録
 */
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * CategoryChartコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {boolean} isLoading - 収支情報のローディング状態
 */
interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

/******************************************************
 * CategoryChart Component
 *
 * @description 円グラフ表示用のコンポーネント
 * 対象月の収支の内訳をカテゴリで分類して円グラフで表示する。
 ******************************************************/
const CategoryChart = ({
  monthlyTransactions,
  isLoading,
}: CategoryChartProps) => {
  const [selectedType, setSelectedType] = useState<TransactionType>("expense");

  /** 円グラフの表示切り替え（支出↔︎収入）時の処理 */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedType(e.target.value as TransactionType);
  };

  /** 対象月における収支のカテゴリ毎の合計を取得 */
  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    );
  /** 円グラフのラベル */
  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];
  /** 円グラフのカテゴリ毎の収支データ */
  const categoryValues = Object.values(categorySums);

  /** 収入カテゴリ用カラーテーマ定義 */
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };
  /** 支出カテゴリ用カラーテーマ定義 */
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    交通費: theme.palette.expenseCategoryColor.交通費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
  };
  /** 収支カテゴリに対応するカラーテーマを取得する処理 */
  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  /** 円グラフ表示オプション */
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };
  /** 円グラフ表示データ設定 */
  const data: ChartData<"pie"> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <TextField
        label="収支の種類"
        select
        fullWidth
        value={selectedType}
        onChange={handleChange}
      >
        <MenuItem value={"income"}>収入</MenuItem>
        <MenuItem value={"expense"}>支出</MenuItem>
      </TextField>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {isLoading ? (
          // データ取得中：ローディング表示
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          // データ取得済み：データ表示
          <Pie data={data} options={options} />
        ) : (
          // データ取得済み：データなし
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
