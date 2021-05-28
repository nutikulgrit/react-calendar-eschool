import { ReactNode } from 'react';
declare type CalendarState = {
    days: Date[];
    currentMonth: Date;
    onCurrentMonthChange: (date: Date) => any;
};
export declare const useMonthlyCalendar: () => CalendarState;
declare type Props = {
    children: ReactNode;
    currentMonth: Date;
    onCurrentMonthChange: (date: Date) => any;
};
export declare const MonthlyCalendar: ({ currentMonth, onCurrentMonthChange, children, }: Props) => JSX.Element;
export declare const MonthlyNav: () => JSX.Element;
export {};
