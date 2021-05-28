import { startOfMonth, eachDayOfInterval, endOfMonth, subMonths, format, getYear, addMonths, getDay, isSameDay, startOfWeek, isSameWeek, setDay } from 'date-fns';
import React, { useContext, useState, useEffect } from 'react';

var MonthlyCalendarContext = /*#__PURE__*/React.createContext({});
var useMonthlyCalendar = function useMonthlyCalendar() {
  return useContext(MonthlyCalendarContext);
};
var MonthlyCalendar = function MonthlyCalendar(_ref) {
  var currentMonth = _ref.currentMonth,
      onCurrentMonthChange = _ref.onCurrentMonthChange,
      children = _ref.children;
  var monthStart = startOfMonth(currentMonth);
  var days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(monthStart)
  });
  return React.createElement(MonthlyCalendarContext.Provider, {
    value: {
      days: days,
      onCurrentMonthChange: onCurrentMonthChange,
      currentMonth: monthStart
    }
  }, children);
};
var MonthlyNav = function MonthlyNav() {
  var _useMonthlyCalendar = useMonthlyCalendar(),
      currentMonth = _useMonthlyCalendar.currentMonth,
      onCurrentMonthChange = _useMonthlyCalendar.onCurrentMonthChange;

  return React.createElement("div", {
    className: "flex justify-end mb-4"
  }, React.createElement("button", {
    onClick: function onClick() {
      return onCurrentMonthChange(subMonths(currentMonth, 1));
    },
    className: "cursor-pointer"
  }, "Previous"), React.createElement("div", {
    className: "ml-4 mr-4 w-32 text-center",
    "aria-label": "Current Month"
  }, format(currentMonth, getYear(currentMonth) === getYear(new Date()) ? 'LLLL' : 'LLLL yyyy')), React.createElement("button", {
    onClick: function onClick() {
      return onCurrentMonthChange(addMonths(currentMonth, 1));
    },
    className: "cursor-pointer"
  }, "Next"));
};

var daysInWeek = [{
  day: 0,
  label: 'Sunday'
}, {
  day: 1,
  label: 'Monday'
}, {
  day: 2,
  label: 'Tuesday'
}, {
  day: 3,
  label: 'Wednesday'
}, {
  day: 4,
  label: 'Thursday'
}, {
  day: 5,
  label: 'Friday'
}, {
  day: 6,
  label: 'Saturday'
}];

var MonthlyBodyContext = /*#__PURE__*/React.createContext({});
function useMonthlyBody() {
  return useContext(MonthlyBodyContext);
}
var handleOmittedDays = function handleOmittedDays(_ref) {
  var days = _ref.days,
      omitDays = _ref.omitDays;
  var headings = daysInWeek;
  var daysToRender = days; //omit the headings and days of the week that were passed in

  if (omitDays) {
    headings = daysInWeek.filter(function (day) {
      return !omitDays.includes(day.day);
    });
    daysToRender = days.filter(function (day) {
      return !omitDays.includes(getDay(day));
    });
  } // omit the padding if an omitted day was before the start of the month


  var firstDayOfMonth = getDay(daysToRender[0]);

  if (omitDays) {
    var subtractOmittedDays = omitDays.filter(function (day) {
      return day < firstDayOfMonth;
    }).length;
    firstDayOfMonth = firstDayOfMonth - subtractOmittedDays;
  }

  var padding = new Array(firstDayOfMonth).fill(0);
  return {
    headings: headings,
    daysToRender: daysToRender,
    padding: padding
  };
}; //to prevent these from being purged in production, we make a lookup object

var headingClasses = {
  l3: 'lg:grid-cols-3',
  l4: 'lg:grid-cols-4',
  l5: 'lg:grid-cols-5',
  l6: 'lg:grid-cols-6',
  l7: 'lg:grid-cols-7'
};
function MonthlyBody(_ref2) {
  var omitDays = _ref2.omitDays,
      events = _ref2.events,
      children = _ref2.children;

  var _useMonthlyCalendar = useMonthlyCalendar(),
      days = _useMonthlyCalendar.days;

  var _handleOmittedDays = handleOmittedDays({
    days: days,
    omitDays: omitDays
  }),
      headings = _handleOmittedDays.headings,
      daysToRender = _handleOmittedDays.daysToRender,
      padding = _handleOmittedDays.padding;

  var headingClassName = 'border-b-2 p-2 border-r-2 lg:block hidden';
  return React.createElement("div", {
    className: "bg-white border-l-2 border-t-2"
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 " + //@ts-ignore
    headingClasses["l" + headings.length]
  }, headings.map(function (day) {
    return React.createElement("div", {
      key: day.day,
      className: headingClassName,
      "aria-label": "Day of Week"
    }, day.label);
  }), padding.map(function (_, index) {
    return React.createElement("div", {
      key: index,
      className: headingClassName,
      "aria-label": "Empty Day"
    });
  }), daysToRender.map(function (day) {
    return React.createElement(MonthlyBodyContext.Provider, {
      key: day.toISOString(),
      value: {
        day: day,
        events: events.filter(function (data) {
          return isSameDay(data.date, day);
        })
      }
    }, children);
  })));
}
function MonthlyDay(_ref3) {
  var renderDay = _ref3.renderDay;

  var _useMonthlyBody = useMonthlyBody(),
      day = _useMonthlyBody.day,
      events = _useMonthlyBody.events;

  var dayNumber = format(day, 'd');
  return React.createElement("div", {
    "aria-label": "Events for day " + dayNumber,
    className: "h-48 p-2 border-b-2 border-r-2"
  }, React.createElement("div", {
    className: "flex justify-between"
  }, React.createElement("div", {
    className: "font-bold"
  }, dayNumber), React.createElement("div", {
    className: "lg:hidden block"
  }, format(day, 'EEEE'))), React.createElement("ul", {
    className: "divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto"
  }, renderDay(events)));
}

var DefaultMonthlyEventItem = function DefaultMonthlyEventItem(_ref) {
  var title = _ref.title,
      date = _ref.date;
  return React.createElement("li", {
    className: "py-2"
  }, React.createElement("div", {
    className: "flex text-sm flex-1 justify-between"
  }, React.createElement("h3", {
    className: "font-medium"
  }, title), React.createElement("p", {
    className: "text-gray-500"
  }, date)));
};

var WeeklyContext = /*#__PURE__*/React.createContext({});
var useWeeklyCalendar = function useWeeklyCalendar() {
  return useContext(WeeklyContext);
};
var WeeklyCalendar = function WeeklyCalendar(_ref) {
  var week = _ref.week,
      children = _ref.children;

  var _useState = useState(),
      selectedDay = _useState[0],
      setSelectedDay = _useState[1]; //clear the selected day if the week changes


  useEffect(function () {
    setSelectedDay(undefined);
  }, [week]);
  return React.createElement(WeeklyContext.Provider, {
    value: {
      selectedDay: selectedDay,
      week: startOfWeek(week),
      changeSelectedDay: setSelectedDay
    }
  }, children);
};
var WeeklyContainer = function WeeklyContainer(_ref2) {
  var children = _ref2.children;
  return React.createElement("div", {
    className: "md:flex md:justify-between"
  }, children);
};

var DayButton = function DayButton(_ref3) {
  var day = _ref3.day;

  var _useWeeklyCalendar = useWeeklyCalendar(),
      week = _useWeeklyCalendar.week,
      selectedDay = _useWeeklyCalendar.selectedDay,
      changeSelectedDay = _useWeeklyCalendar.changeSelectedDay;

  var isSelected = selectedDay ? getDay(selectedDay) === day.day : false;
  var currentDate = setDay(week, day.day);
  return React.createElement("li", {
    onClick: function onClick() {
      return changeSelectedDay(isSelected ? undefined : currentDate);
    },
    className: "bg-white cursor-pointer",
    "aria-label": "Day of Week"
  }, React.createElement("div", {
    className: "rounded-lg border sm:w-36 text-center py-4 " + (isSelected ? 'border-indigo-600' : 'border-gray-300 hover:border-gray-500')
  }, React.createElement("p", {
    className: "font-medium text-sm text-gray-800"
  }, day.label, " ", format(currentDate, 'do'))));
};

var WeeklyDays = function WeeklyDays(_ref4) {
  var omitDays = _ref4.omitDays;
  var daysToRender = daysInWeek;

  if (omitDays) {
    daysToRender = daysInWeek.filter(function (day) {
      return !omitDays.includes(day.day);
    });
  }

  return React.createElement("ul", {
    className: "grid md:grid-cols-1 grid-cols-2 gap-2"
  }, daysToRender.map(function (day) {
    return React.createElement(DayButton, {
      key: day.day,
      day: day
    });
  }));
};
function WeeklyBody(_ref5) {
  var events = _ref5.events,
      renderItem = _ref5.renderItem,
      style = _ref5.style;

  var _useWeeklyCalendar2 = useWeeklyCalendar(),
      week = _useWeeklyCalendar2.week,
      selectedDay = _useWeeklyCalendar2.selectedDay;

  return React.createElement("div", {
    className: "overflow-auto max-h-96",
    style: style
  }, React.createElement("ul", {
    className: "divide-y divide-gray-200 "
  }, events.map(function (item) {
    // If they select a single day, filter out events for different days
    if (selectedDay) {
      if (!isSameDay(selectedDay, item.date)) return null;
    } //if an event is for a different week, filter it out


    if (!isSameWeek(week, item.date)) return null; //return the remeaining events!

    return renderItem({
      item: item,
      showingFullWeek: selectedDay === undefined
    });
  })));
}
var WeeklyResponsiveContainer = function WeeklyResponsiveContainer(_ref6) {
  var children = _ref6.children;
  return React.createElement("div", {
    className: "border p-4 md:w-3/4 lg:w-1/2 w-full"
  }, children);
};

var DefaultWeeklyEventItem = function DefaultWeeklyEventItem(_ref) {
  var title = _ref.title,
      date = _ref.date;
  return React.createElement("li", {
    className: "py-4 w-72"
  }, React.createElement("div", {
    className: "text-sm flex justify-between"
  }, React.createElement("h3", {
    className: "font-medium"
  }, title), React.createElement("p", {
    className: "text-gray-500"
  }, date)));
};

export { DefaultMonthlyEventItem, DefaultWeeklyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav, WeeklyBody, WeeklyCalendar, WeeklyContainer, WeeklyDays, WeeklyResponsiveContainer, handleOmittedDays, useMonthlyBody, useMonthlyCalendar, useWeeklyCalendar };
//# sourceMappingURL=react-calendar.esm.js.map
