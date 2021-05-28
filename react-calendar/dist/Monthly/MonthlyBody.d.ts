import { ReactNode } from 'react';
declare type BodyState<DayData> = {
    day: Date;
    events: DayData[];
};
export declare function useMonthlyBody<DayData>(): BodyState<DayData>;
declare type OmittedDaysProps = {
    days: Date[];
    omitDays?: number[];
};
export declare const handleOmittedDays: ({ days, omitDays }: OmittedDaysProps) => {
    headings: {
        day: number;
        label: string;
    }[];
    daysToRender: Date[];
    padding: any[];
};
declare type MonthlyBodyProps<DayData> = {
    omitDays?: number[];
    events: (DayData & {
        date: Date;
    })[];
    children: ReactNode;
};
export declare function MonthlyBody<DayData>({ omitDays, events, children, }: MonthlyBodyProps<DayData>): JSX.Element;
declare type MonthlyDayProps<DayData> = {
    renderDay: (events: DayData[]) => ReactNode;
};
export declare function MonthlyDay<DayData>({ renderDay }: MonthlyDayProps<DayData>): JSX.Element;
export {};
