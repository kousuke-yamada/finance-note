import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

/**
 * DailySummaryコンポーネントの Props 型定義
 * @property {Transaction[]} dailyTransactions - 対象日の収支情報
 * @property {number} coloums - 表示列数（※PC用とモバイル用で表示方法を切り替え）
 */
interface DailySummaryProps {
  dailyTransactions: Transaction[];
  coloums: number;
}

/******************************************************
 * DailySummary Component
 *
 * @description 日毎の合計収支を表示するコンポーネント
 ******************************************************/
const DailySummary = ({ dailyTransactions, coloums }: DailySummaryProps) => {
  /** 対象日の収入・支出・残高を取得 */
  const { income, expense, balance } = financeCalculations(dailyTransactions);
  /** レイアウト判定フラグ（表示列が３列の場合は、モバイル用のレイアウトとする） */
  const isThreeColumsLayout = coloums === 3;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* 収入 */}
        <Grid size={{ xs: isThreeColumsLayout ? 4 : 6 }} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                収入
              </Typography>
              <Typography
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{
                  color: (theme) => theme.palette.incomeColor.main,
                  wordBreak: "break-all",
                }}
              >
                ¥{formatCurrency(income)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 支出 */}
        <Grid size={{ xs: isThreeColumsLayout ? 4 : 6 }} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                支出
              </Typography>
              <Typography
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{
                  color: (theme) => theme.palette.expenseColor.main,
                  wordBreak: "break-all",
                }}
              >
                ¥{formatCurrency(expense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 残高 */}
        <Grid size={{ xs: isThreeColumsLayout ? 4 : 12 }} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                残高
              </Typography>
              <Typography
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{
                  color: (theme) => theme.palette.balanceColor.main,
                  wordBreak: "break-all",
                }}
              >
                ¥{formatCurrency(balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DailySummary;
