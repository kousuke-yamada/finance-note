import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySUmmary";
import { Transaction } from "../types";
import { formatCurrency } from "../utils/formatting";
import IconComponents from "./common/IconComponents";

/**
 * TransactionMenuコンポーネントの Props 型定義
 * @property {Transaction[]} dailyTransactions - 対象日の収支情報
 * @property {string} currentDay - 現在選択している日付
 * @property {() => void} onAddTransactionForm - +内訳を追加ボタン押下時のコールバック関数
 * @property {(transaction: Transaction) => void} onSelectTransaction - 取引カード選択時のコールバック関数
 * @property {boolean} isMobile - モバイルサイズ判定フラグ
 * @property {boolean} open - モバイル用：日毎収支を表示するDrawerの開閉状態
 * @property {() => void} onClose - モバイル用：日毎収支を表示するDrawerクローズ時のコールバック関数
 */
interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

/******************************************************
 * TransactionMenu Component
 *
 * @description 日毎収支一覧を表示するコンポーネント。
 * 日毎の収支、取引一覧、及び、収支入力フォーム(Drawer)の開閉ボタンを表示。
 ******************************************************/
const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionForm,
  onSelectTransaction,
  isMobile,
  open,
  onClose,
}: TransactionMenuProps) => {
  /** 日毎収支一覧の画面幅 */
  const menuDrawerWidth = 320;

  return (
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,
          // モバイル用のスタイル
          ...(isMobile && {
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          // 通常のスタイル
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      slotProps={{
        root: {
          keepMounted: true,
        },
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        {/* 日付 */}
        <Typography fontWeight={"fontWeightBold"}>
          日時： {currentDay}
        </Typography>

        {/* 日毎の収支 */}
        <DailySummary
          dailyTransactions={dailyTransactions}
          coloums={isMobile ? 3 : 2}
        />

        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>

          {/* 右側の追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={onAddTransactionForm}
          >
            内訳を追加
          </Button>
        </Box>

        {/* 取引一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {dailyTransactions.map((transaction, index) => (
                <ListItem disablePadding key={index}>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor:
                        transaction.type === "income"
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectTransaction(transaction)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          wrap="wrap"
                        >
                          <Grid size={{ xs: 1 }}>
                            {/* icon */}
                            {IconComponents[transaction.category]}
                          </Grid>
                          <Grid size={{ xs: 2.5 }}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {transaction.category}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Typography variant="body2" gutterBottom>
                              {transaction.content}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 4.5 }}>
                            <Typography
                              gutterBottom
                              textAlign={"right"}
                              color="text.secondary"
                              sx={{
                                wordBreak: "break-all",
                              }}
                            >
                              ¥{formatCurrency(transaction.amount)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default TransactionMenu;
