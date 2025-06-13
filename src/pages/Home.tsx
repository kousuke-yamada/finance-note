import { Box } from "@mui/material";
import React from "react";
import MonthlySummary from "../components/layout/MonthlySummary";
import Calendar from "../components/layout/Calendar";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1, bgcolor: "pink" }}>
        <MonthlySummary />
        <Calendar />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  );
};

export default Home;
