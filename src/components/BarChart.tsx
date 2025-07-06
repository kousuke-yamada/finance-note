import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Chart.js用コンポーネント登録
 * 棒グラフ(<Bar>コンポーネント)描画に必要な要素をグローバルレジストリに事前登録
 */
ChartJS.register(
  CategoryScale, // X軸：カテゴリラベル用
  LinearScale, // Y軸：数値スケール用
  BarElement, // 棒グラフの描画要素
  Title, // グラフタイトル
  Tooltip, // ホバー時のツールチップ
  Legend // 凡例表示
);

/**
 * BarChartコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {boolean} isLoading - 収支情報のローディング状態
 */
interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

/******************************************************
 * BarChart Component
 *
 * @description 棒グラフ表示用のコンポーネント
 * 対象月における日別の収支を棒グラフで表示する。
 ******************************************************/
const BarChart = ({ monthlyTransactions, isLoading }: BarChartProps) => {
  const theme = useTheme();

  /** 対象月における日付ごとの収支を取得 */
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  /** 棒グラフのラベル */
  const dataLabels = Object.keys(dailyBalances).sort();
  /** 棒グラフの支出用データ */
  const expenseData = dataLabels.map((day) => dailyBalances[day].expense);
  /** 棒グラフの収入用データ */
  const incomeData = dataLabels.map((day) => dailyBalances[day].income);

  /** 棒グラフ表示オプション */
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "日別収支",
      },
    },
  };
  /** 棒グラフ表示データ設定 */
  const data: ChartData<"bar"> = {
    labels: dataLabels,
    datasets: [
      {
        label: "支出",
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
      },
      {
        label: "収入",
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.light,
      },
    ],
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        // データ取得中：ローディング表示
        <CircularProgress />
      ) : monthlyTransactions.length > 0 ? (
        // データ取得済み：データ表示
        <Bar options={options} data={data} />
      ) : (
        // データ取得済み：データなし
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;
