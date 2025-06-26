import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { Balance, CalendarContent, Transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { Palette } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const theme = useTheme();

  // 日付ごとの収支を計算する
  const dayilyBalances = calculateDailyBalances(monthlyTransactions);

  // FullCalendar用のイベントを生成する
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
  const calendarEvents = createCalendarEvents(dayilyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };
  console.log([...calendarEvents, backgroundEvent]);

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

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();

    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  // const handaleDateClick = (dateInfo: DateClickArg) => {
  //   setCurrentDay(dateInfo.dateStr);
  // };

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
