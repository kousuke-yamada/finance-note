import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { Balance, CalendarContent, Transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import { Dispatch, SetStateAction } from "react";

/**
 * FlashMessageコンポーネントの Props 型定義
 * @property {Transaction[]} monthlyTransactions - 対象月の全収支情報
 * @property {Dispatch<SetStateAction<Date>>} setCurrentMonth - 現在表示している月のステート更新関数
 * @property {Dispatch<SetStateAction<string>>} setCurrentDay - 現在選択している日付のステート更新関数
 * @property {string} currentDay - 現在選択している日付
 * @property {string} today - 今日の日付（現在時刻の基準日）
 * @property {(dateInfo: DateClickArg) => void} onDateClick - カレンダー上の日付クリック時のコールバック関数
 */
interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
  setCurrentDay: Dispatch<SetStateAction<string>>;
  currentDay: string;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}

/******************************************************
 * Calendar Component
 *
 * @description カレンダー表示用のコンポーネント。
 ******************************************************/
const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const theme = useTheme();

  /** 対象月における日付ごとの収支を取得 */
  const dayilyBalances = calculateDailyBalances(monthlyTransactions);

  /** FullCalendar用のイベントを生成する処理 */
  const createCalendarEvents = (
    dayilyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dayilyBalances).map((date) => {
      const { income, expense, balance } = dayilyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };
  /** FullCalendarのイベントデータ */
  const calendarEvents = createCalendarEvents(dayilyBalances);

  /** FullCalendarの背景イベント （現在選択中の日付の背景色として表示） */
  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  /** FullCalendar上のイベント表示方法の定義 */
  const renderEventContent = (eventinfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventinfo.event.extendedProps.income}
        </div>
        <div className="money" id="event-expense">
          {eventinfo.event.extendedProps.expense}
        </div>
        <div className="money" id="event-balance">
          {eventinfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  /** カレンダー表示月変更<>ボタン押下時（表示期間が変更された時）の処理 */
  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const todayDate = new Date();
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);

    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  );
};

export default Calendar;
