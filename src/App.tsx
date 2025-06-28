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
import { format } from "date-fns";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";
import Login from "./pages/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { FlashMessageProvider } from "./contexts/FlashMessageContext";
import SignUp from "./pages/SignUp";

function App() {
  function isFireStoreError(
    err: unknown
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const [user, loading, error] = useAuthState(auth);
  const uid = user ? user.uid : "guest";

  console.log("現在のUID", uid);

  // firestoreからデータ取得
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
          console.error("firestoreのエラー :", err);
          console.error("firestoreのエラーメッセージ :", err.message);
          console.error("firestoreのエラーコード :", err.code);
        } else {
          console.log("一般的なエラー :", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [uid]);

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    // console.log("送信データ", transaction);
    try {
      // fireStoreにデータを保存
      // Add a new document with a generated id.
      const docRef = await addDoc(
        collection(db, "users", uid, "Transactions"),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);

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
        console.error("firestoreのエラー :", err);
        console.error("firestoreのエラーメッセージ :", err.message);
        console.error("firestoreのエラーコード :", err.code);
      } else {
        console.log("一般的なエラー :", err);
      }
    }
  };

  // 取引を削除する処理
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
        console.error("firestoreのエラー :", err);
        console.error("firestoreのエラーメッセージ :", err.message);
        console.error("firestoreのエラーコード :", err.code);
      } else {
        console.log("一般的なエラー :", err);
      }
    }
  };

  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      // firestoreのデータ更新
      const docRef = doc(db, "users", uid, "Transactions", transactionId);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef, transaction);

      //画面更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラー :", err);
        console.error("firestoreのエラーメッセージ :", err.message);
        console.error("firestoreのエラーコード :", err.code);
      } else {
        console.log("一般的なエラー :", err);
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
              <Route path="/login" element={<Login />} />
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
