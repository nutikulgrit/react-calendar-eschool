import { CSSProperties, ReactNode } from 'react';
declare type State = {
    week: Date;
    selectedDay?: Date;
    changeSelectedDay: (day?: Date) => any;
};
export declare const useWeeklyCalendar: () => State;
declare type WeeklyCalendarProps = {
    week: Date;
    children: ReactNode;
};
export declare const WeeklyCalendar: ({ week, children }: WeeklyCalendarProps) => JSX.Element;
declare type WeeklyContainerProps = {
    children: ReactNode;
};
export declare const WeeklyContainer: ({ children }: WeeklyContainerProps) => JSX.Element;
declare type WeeklyDaysProps = {
    omitDays?: number[];
};
export declare const WeeklyDays: ({ omitDays }: WeeklyDaysProps) => JSX.Element;
declare type RenderItemProps<EventItem> = {
    item: EventItem & {
        date: Date;
    };
    showingFullWeek: boolean;
};
declare type WeeklyBodyProps<EventItem> = {
    style?: CSSProperties;
    events: (EventItem & {
        date: Date;
    })[];
    renderItem: (item: RenderItemProps<EventItem>) => ReactNode;
};
export declare function WeeklyBody<EventItem>({ events, renderItem, style, }: WeeklyBodyProps<EventItem>): JSX.Element;
export declare const WeeklyResponsiveContainer: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
export {};
