import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { Grid } from "@mui/material";
import { formatCurrency } from "../utils/formatting";
import IconComponents from "./common/IconComponents";
import { compareDesc, parseISO } from "date-fns";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";

/**
 * TransactionTableHeadコンポーネントの Props 型定義
 * @property {number} numSelected - 収支テーブルのチェックボックス選択数
 * @property {(event: ChangeEvent<HTMLInputElement>) => void} onSelectAllClick - 収支テーブルのチェックボックス一括選択時のコールバック関数
 * @property {number} rowCount - テーブル行数（※表示する収支データの件数）
 */
interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

/******************************************************
 * TransactionTableHead Component
 *
 * @description 収支データテーブルのヘッダ部を表示するコンポーネント。
 * ヘッダ部のチェックボックスにより、各項目のチェックボックス一括選択が可能。
 ******************************************************/
function TransactionTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: TransactionTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "select all desserts",
              },
            }}
          />
        </TableCell>

        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>カテゴリ</TableCell>
        <TableCell align={"left"}>金額</TableCell>
        <TableCell align={"left"}>内容</TableCell>
      </TableRow>
    </TableHead>
  );
}

/**
 * TransactionTableToolbarコンポーネントの Props 型定義
 * @property {number} numSelected - 収支テーブルのチェックボックス選択数
 * @property {() => void} onDelete - 削除ボタン（ゴミ箱アイコン）押下時のコールバック関数
 */
interface TransactionTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
}

/******************************************************
 * TransactionTableToolbar Component
 *
 * @description 収支データテーブルのツールバーを表示するコンポーネント。
 * ヘッダ部、及び、各収支データのチェックボックス選択時にこのツールバーを表示。
 ******************************************************/
function TransactionTableToolbar({
  numSelected,
  onDelete,
}: TransactionTableToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
          textAlign={"left"}
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
          textAlign={"left"}
        >
          月間収支
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

/**
 * FinancialItemコンポーネントの Props 型定義
 * @property {string} title - 表示タイトル
 * @property {number} value - 表示金額
 * @property {string} color -　　表示文字色
 */
interface FinancialItemProps {
  title: string;
  value: number;
  color: string;
}

/******************************************************
 * FinancialItem Component
 *
 * @description 収支項目を表示するコンポーネント。
 *　入力値に対して、「支出 ¥1,000」の形式で出力する。
 ******************************************************/
function FinancialItem({ title, value, color }: FinancialItemProps) {
  return (
    <Grid size={{ xs: 4 }} textAlign={"center"}>
      <Typography variant="subtitle1" component={"div"}>
        {title}
      </Typography>
      <Typography
        component={"span"}
        fontWeight={"fontWeightBold"}
        sx={{
          color: color,
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
          wordBreak: "break-word",
        }}
      >
        ¥{formatCurrency(value)}
      </Typography>
    </Grid>
  );
}

/**
 * TransactionTableコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {(
    transactionId: string | readonly string[]
  ) => Promise<void>} onDeleteTransaction - 対象の収支データをFirebaseから削除する非同期関数
 */
interface TransactionTableProps {
  monthlyTransactions: Transaction[];
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
}

/******************************************************
 * TransactionTable Component
 *
 * @description 収支テーブル本体を表示するコンポーネント。
 *　月間収支表示、ツールバー、ヘッダ、ボディ、フッターで構成。
 ******************************************************/
const TransactionTable = ({
  monthlyTransactions,
  onDeleteTransaction,
}: TransactionTableProps) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /** 収支テーブルヘッダ：チェックボックス一括選択時の処理 */
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /** 収支テーブルボディ：収支データの行をクリックした時の処理 */
  const handleClick = (event: MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  /** 収支テーブルフッター：ページネーションのページ切り替えボタン押下時の処理 */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /** 収支テーブルフッター：テーブルの収支データ表示件数（Rows per page）変更ボタン押下時の処理 */
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /** 収支テーブルツールバー：削除ボタン（ゴミ箱アイコン）押下時の処理 */
  const handleDelete = () => {
    onDeleteTransaction(selected);
  };

  /** テーブルボディ：空行数設定（レイアウト調整用）
   *  収支データのページネーションの最終ページにて、データ表示件数（Rows per page）に足りない分を空行で埋める。
   */
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - monthlyTransactions.length)
      : 0;

  /** テーブルボディ： データ表示件数（Rows per page）分の収支データを取得
   *  日付が新しいデータから降順でソートする。
   */
  const visibleRows = useMemo(() => {
    const sortMonthlyTransactions = [...monthlyTransactions].sort((a, b) =>
      compareDesc(parseISO(a.date), parseISO(b.date))
    );
    return sortMonthlyTransactions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, monthlyTransactions]);

  /** 月間収支表示：対象月の各収支タイプ（収入・支出・残高）ごとの合計値 */
  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* 月間収支表示 */}
        <Grid container sx={{ borderBottom: "1px solid rgba(224,224,224,1)" }}>
          {/* 収入 */}
          <FinancialItem
            title={"収入"}
            value={income}
            color={theme.palette.incomeColor.main}
          />
          {/* 支出 */}
          <FinancialItem
            title={"支出"}
            value={expense}
            color={theme.palette.expenseColor.main}
          />
          {/* 残高 */}
          <FinancialItem
            title={"残高"}
            value={balance}
            color={theme.palette.balanceColor.main}
          />
        </Grid>

        {/* ツールバー */}
        <TransactionTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
        />

        {/* 取引一覧 */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            {/* テーブルヘッダ */}
            <TransactionTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthlyTransactions.length}
            />
            {/* テーブル本体 */}
            <TableBody>
              {visibleRows.map((transaction, index) => {
                const isItemSelected = selected.includes(transaction.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, transaction.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={transaction.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            "aria-labelledby": labelId,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {transaction.date}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {/* icon */}
                      {IconComponents[transaction.category]}
                      {transaction.category}
                    </TableCell>
                    <TableCell align="left">{transaction.amount}</TableCell>
                    <TableCell align="left">{transaction.content}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* テーブルフッター */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={monthlyTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TransactionTable;
