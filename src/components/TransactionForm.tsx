import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, transactionSchema } from "../validations/schema";

/**
 * TransactionFormコンポーネントの Props 型定義
 * @property {() => void} onCloseForm - 収支入力フォームの×ボタン押下時のコールバック関数
 * @property {boolean} isEntryDrawerOpen - 収支入力フォームのDrawer開閉状態
 * @property {string} currentDay - 現在選択している日付
 * @property {(transaction: Schema) => Promise<void>} onSaveTransaction - 対象日の収支データをFirebaseに保存する非同期関数
 * @property {Transaction | null} selectedTransaction - 選択した取引カードの収支データ
 * @property {Dispatch<SetStateAction<Transaction | null>>} setSelectedTransaction -選択した取引カードの収支内容のステート更新関数
 * @property {(
    transactionId: string | readonly string[]
  ) => Promise<void>} onDeleteTransaction - 選択中の取引カードの収支データをFirebaseから削除する非同期関数
 * @property {(
    transaction: Schema,
    transactionId: string
  ) => Promise<void>} onUpdateTransaction - 選択中の取引カードの収支データをFirebaseへ保存（更新）する非同期関数
 * @property {boolean} isMobile - モバイルサイズ判定フラグ
 * @property {boolean} isDialogOpen - モバイル用収支入力フォームのダイアログ表示判定フラグ
 * @property {Dispatch<SetStateAction<boolean>>} setIsDialogOpen - モバイル用収支入力フォームのダイアログ表示判定フラグのステート更新関数
 */
interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: Dispatch<SetStateAction<Transaction | null>>;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
  isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}
/**
 * 収支入力フォームのカテゴリ 型定義
 * @property {IncomeCategory | ExpenseCategory} label - カテゴリのラベル
 * @property {JSX.Element} icon - カテゴリのアイコン
 */
interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}
/** 収支タイプの定義 */
type IncomeExpense = "income" | "expense";

/** 収支入力フォームの画面幅 */
const formWidth = 320;

/******************************************************
 * TransactionForm Component
 *
 * @description 対象日の収支入力フォーム表示用のコンポーネント。
 ******************************************************/
const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  setSelectedTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
  isMobile,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) => {
  /** 収支入力フォームの支出カテゴリ定義 */
  const expenseCategories: CategoryItem[] = [
    { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
    { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
    { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
  ];
  /** 収支入力フォームの収入カテゴリ定義 */
  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <WorkIcon fontSize="small" /> },
    { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
    { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
  ];
  const [categories, setCategories] = useState(expenseCategories);

  // 収支入力フォームの初期化とバリデーション設定
  // - Zod スキーマ（transactionSchema）によるバリデーション
  // - type/date/amount/category/content の初期値を定義
  // - フォーム操作用の関数（control, setValue, watch など）を取得
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: "expense" as const,
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionSchema),
  });

  // 収支タイプを監視
  const currentType = watch("type");

  // 現在選択している日付が変更された時に、フォームの「日付」項目を更新
  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay]);

  // 収支切り替えボタンにより収支タイプが変更（支出↔︎収入）された時に、カテゴリ項目のステート更新
  useEffect(() => {
    const newCategories =
      currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType]);

  // 取引カード選択時、その選択した取引カードの収支タイプに応じたカテゴリ項目をフォームに反映
  useEffect(() => {
    if (selectedTransaction) {
      const categoryExist = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue("category", categoryExist ? selectedTransaction.category : "");
    }
  }, [selectedTransaction, categories]);

  // 選択中の取引カードが変更された時に、フォームの収支データの内容を更新
  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: "",
      });
    }
  }, [selectedTransaction]);

  /** 保存・更新ボタン押下時（フォーム内容送信時）の処理 */
  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          setSelectedTransaction(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    });
  };

  /** 収支切り替えボタン押下時の処理 */
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
    setValue("category", "");
  };

  /** 削除ボタン押下時の処理 */
  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);

      if (isMobile) {
        setIsDialogOpen(false);
      }
    }
  };

  /** 収支入力フォーム本体 */
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button
                  variant={field.value === "expense" ? "contained" : "outlined"}
                  color="error"
                  onClick={() => incomeExpenseToggle("expense")}
                >
                  支出
                </Button>
                <Button
                  variant={field.value === "income" ? "contained" : "outlined"}
                  color={"primary"}
                  onClick={() => incomeExpenseToggle("income")}
                >
                  収入
                </Button>
              </ButtonGroup>
            )}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.category}
                helperText={errors.category?.message}
                {...field}
                id="カテゴリ"
                label="カテゴリ"
                select
              >
                {categories.map((category, index) => (
                  <MenuItem value={category.label} key={index}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
              />
            )}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content}
                helperText={errors.content?.message}
                {...field}
                label="内容"
                type="text"
              />
            )}
          />

          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === "income" ? "primary" : "error"}
            fullWidth
          >
            {selectedTransaction ? "更新" : "保存"}
          </Button>

          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color={"secondary"}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        // モバイル用
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth={"sm"}
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        // PC用
        <Box
          sx={{
            position: "fixed",
            top: 64,
            right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
            width: formWidth,
            height: "100%",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create("right", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 15px -5px #777777",
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
};
export default TransactionForm;
