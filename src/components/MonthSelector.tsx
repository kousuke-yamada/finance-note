import { Box, Button } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ja } from "date-fns/locale";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";
import { addMonths } from "date-fns";
import { PickerValue } from "@mui/x-date-pickers/internals";

interface MonthSelectorProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
}: MonthSelectorProps) => {
  // 【先月】ボタン押下時の処理
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    setCurrentMonth(previousMonth);
  };
  // 【次月】ボタン押下時の処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };
  // 【DatePicker】で年月を選択した時の処理
  const handleDateChange = (newDate: PickerValue) => {
    if (newDate) {
      setCurrentMonth(newDate as Date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          onClick={handlePreviousMonth}
          color={"error"}
          variant="contained"
        >
          先月
        </Button>
        <DatePicker
          label="年月を選択"
          sx={{ mx: 2, background: "white" }}
          value={currentMonth}
          onChange={handleDateChange}
          format="yyyy年M月"
          views={["year", "month"]}
          slotProps={{ calendarHeader: { format: "yyyy年M月" } }}
        />
        <Button onClick={handleNextMonth} color={"primary"} variant="contained">
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
