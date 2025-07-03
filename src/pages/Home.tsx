import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";
import { format } from "date-fns";
import { Schema } from "../validations/schema";
import { DateClickArg } from "@fullcalendar/interaction";

/**
 * Homeコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {Dispatch<SetStateAction<Date>>} setCurrentMonth - 現在表示している月のステート更新関数
 * @property {(transaction: Schema) => Promise<void>} onSaveTransaction - 対象日の収支データをFirebaseに保存する非同期関数
 * @property {(
    transactionId: string | readonly string[]
  ) => Promise<void>} onDeleteTransaction - 選択中の取引カードの収支データをFirebaseから削除する非同期関数
* @property {(
    transaction: Schema,
    transactionId: string
  ) => Promise<void>} onUpdateTransaction - 選択中の取引カードの収支データをFirebaseへ保存（更新）する非同期関数
 */
interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}

/******************************************************
 * Home Component
 *
 * @description Homeページを表示するコンポーネント
 ******************************************************/
const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const theme = useTheme();

  /** モバイル判定フラグ
   * （画面幅が"lg"ブレークポイント（1200px）未満の場合、モバイル用
   * （画面幅が"lg"ブレークポイント（1200px）以上の場合、PC用
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  /** 現在選択中の日付に対応する収支データを取得 */
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

  /**  【×ボタン】押下時の処理 */
  const CloseForm = () => {
    setSelectedTransaction(null);

    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  /** 【+内訳を追加ボタン】押下時の処理（フォームの開閉処理 */
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  };

  /** 取引カード選択時の処理 */
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);

    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  };

  /** モバイル用Drawerを閉じる処理 */
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  /** カレンダー上の日付クリック時の処理 */
  const handaleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateClick={handaleDateClick}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={CloseForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          onUpdateTransaction={onUpdateTransaction}
          isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;
