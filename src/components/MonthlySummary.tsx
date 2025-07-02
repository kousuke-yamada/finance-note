import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

/**
 * MonthlySummaryコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 */
interface MonthlySummaryProps {
  monthlyTransactions: Transaction[];
}

/******************************************************
 * MonthlySummary Component
 *
 * @description 対象月の合計収支を表示するコンポーネント
 ******************************************************/
const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  /** 対象月の収入・支出・残高を取得 */
  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 収入 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: "white",
            borderRadius: "10px",
            flexFlow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ArrowUpwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(income)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 支出 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: "white",
            borderRadius: "10px",
            flexFlow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ArrowDownwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(expense)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 残高 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: "white",
            borderRadius: "10px",
            flexFlow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MonthlySummary;
