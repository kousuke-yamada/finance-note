import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Transaction } from "./types/index";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";
import { useAuthState } from "react-firebase-hooks/auth";
import { FlashMessageProvider } from "./contexts/FlashMessageContext";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

/******************************************************
 * App Component
 *
 * @description アプリケーションのルートコンポーネント
 ******************************************************/
function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  /** ユーザー情報（Firebase Authenticationからユーザー情報取得） */
  const [user] = useAuthState(auth);
  /** ユーザーID（非ログイン時はゲスト扱い） */
  const uid = user ? user.uid : "guest";

  /** FireStoreエラー判定 */
  function isFireStoreError(
    err: unknown
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  /** FireStore Databaseからの収支データ取得処理 */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", uid, "Transactions")
        );
        // const querySnapshot = await getDocs(collection(db, "Transactions"));

        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreデータ取得エラー :", err);
        } else {
          console.error("データ取得エラー:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [uid]);

  /** 対象月の全収支データ */
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  /** FireStore Databaseへの収支データ追加処理 */
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      // fireStoreにデータを保存
      const docRef = await addDoc(
        collection(db, "users", uid, "Transactions"),
        transaction
      );

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreデータ保存エラー :", err);
      } else {
        console.error("データ保存エラー:", err);
      }
    }
  };

  /** FireStore Databaseの収支データ削除処理 */
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];

      for (const id of idsToDelete) {
        // firestoreのデータ削除
        await deleteDoc(doc(db, "users", uid, "Transactions", id));
      }

      const filteredTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );

      setTransactions(filteredTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreデータ削除エラー :", err);
      } else {
        console.error("データ削除エラー :", err);
      }
    }
  };

  /** FireStore Databaseの収支データ更新処理 */
  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      // firestoreのデータ更新
      const docRef = doc(db, "users", uid, "Transactions", transactionId);
      await updateDoc(docRef, transaction);

      //画面更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreデータ更新エラー :", err);
      } else {
        console.error("データ更新エラー :", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FlashMessageProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                    monthlyTransactions={monthlyTransactions}
                    setCurrentMonth={setCurrentMonth}
                    onSaveTransaction={handleSaveTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <Report
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    monthlyTransactions={monthlyTransactions}
                    isLoading={isLoading}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FlashMessageProvider>
    </ThemeProvider>
  );
}

export default App;
