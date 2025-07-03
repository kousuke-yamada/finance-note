import { Box, Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ja } from "date-fns/locale";
import "dayjs/locale/ja";
import { addMonths } from "date-fns";
import { PickerValue } from "@mui/x-date-pickers/internals";

/**
 * MonthSelectorコンポーネントの Props 型定義
 * @property {Date} currentMonth - 現在表示している月
 * @property {Dispatch<SetStateAction<Date>>} setCurrentMonth - 現在表示している月のステート更新関数
 */
interface MonthSelectorProps {
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
}

/******************************************************
 * MonthSelector Component
 *
 * @description 収支を表示する対象月を選択するコンポーネント
 * DatePickerを用いて、年月を指定する。
 ******************************************************/
const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
}: MonthSelectorProps) => {
  /**  【先月】ボタン押下時の処理 */
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    setCurrentMonth(previousMonth);
  };
  /**  【次月】ボタン押下時の処理 */
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };
  /** 【DatePicker】で年月を選択した時の処理 */
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
