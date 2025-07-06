import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import {
  amber,
  blue,
  cyan,
  deepOrange,
  green,
  lightBlue,
  lightGreen,
  pink,
  purple,
  red,
  lime,
} from "@mui/material/colors";
import { ExpenseCategory, IncomeCategory } from "../types";

// カスタムテーマのプロパティ定義（MUIのテーマ型を拡張）
declare module "@mui/material/styles" {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
    incomeCategoryColor: Record<IncomeCategory, string>;
    expenseCategoryColor: Record<ExpenseCategory, string>;
  }
  interface PaletteOptions {
    incomeColor?: PaletteColorOptions;
    expenseColor?: PaletteColorOptions;
    balanceColor?: PaletteColorOptions;
    incomeCategoryColor?: Record<IncomeCategory, string>;
    expenseCategoryColor?: Record<ExpenseCategory, string>;
  }
}

// アプリ全体で使用する共通MUIテーマ追加
export const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, "Roboto","Helvetica","Arial",sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  palette: {
    // 収入用の色を定義
    incomeColor: {
      main: lightBlue[500],
      light: lightBlue[100],
      dark: lightBlue[700],
    },
    // 支出用の色を定義
    expenseColor: {
      main: pink[500],
      light: pink[100],
      dark: pink[700],
    },
    // 残高用の色を定義
    balanceColor: {
      main: lightGreen[500],
      light: lightGreen[100],
      dark: lightGreen[700],
    },
    // 収入カテゴリ用の色定義
    incomeCategoryColor: {
      給与: lightBlue[600],
      副収入: cyan[200],
      お小遣い: lightGreen["A700"],
    },
    // 支出カテゴリ用の色定義
    expenseCategoryColor: {
      食費: deepOrange[500],
      日用品: lightGreen[500],
      住居費: amber[500],
      交際費: pink[300],
      娯楽: cyan[200],
      交通費: purple[400],
    },
  },
});
