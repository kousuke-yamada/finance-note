import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { Balance, CalendarContent, Transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar = ({ monthlyTransactions, setCurrentMonth }: CalendarProps) => {
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
    setCurrentMonth(datesetInfo.view.currentStart);
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
    />
  );
};

export default Calendar;
