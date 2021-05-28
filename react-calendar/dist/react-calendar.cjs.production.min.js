'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var dateFns = require('date-fns');
var React = require('react');
var React__default = _interopDefault(React);

var MonthlyCalendarContext = /*#__PURE__*/React__default.createContext({});
var useMonthlyCalendar = function useMonthlyCalendar() {
  return React.useContext(MonthlyCalendarContext);
};
var MonthlyCalendar = function MonthlyCalendar(_ref) {
  var currentMonth = _ref.currentMonth,
      onCurrentMonthChange = _ref.onCurrentMonthChange,
      children = _ref.children;
  var monthStart = dateFns.startOfMonth(currentMonth);
  var days = dateFns.eachDayOfInterval({
    start: monthStart,
    end: dateFns.endOfMonth(monthStart)
  });
  return React__default.createElement(MonthlyCalendarContext.Provider, {
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
  var month = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
  return React__default.createElement("div", {
    className: "flex mb-4"
  }, React__default.createElement("b", {
    className: "ml-4 mr-4 w-32 text-center h4",
    "aria-label": "Current Month"
  }, month[dateFns.format(currentMonth, 'L')]+" "+dateFns.format(currentMonth, 'yyyy')), React__default.createElement("button", {
    onClick: function onClick() {
      return onCurrentMonthChange(dateFns.subMonths(currentMonth, 1));
    },
    className: "cursor-pointer btn btn-outline-secondary mr-2 ml-2 icon text-secondary small-icon btn-2"
  }, "\uf060"), React__default.createElement("button", {
    onClick: function onClick() {
      return onCurrentMonthChange(dateFns.addMonths(currentMonth, 1));
    },
    className: "cursor-pointer btn btn-outline-secondary mr-2 ml-2 icon text-secondary small-icon btn-2"
  }, "\uf061"));
};

var daysInWeek = [{
  day: 0,
  label: 'อาทิตย์'
}, {
  day: 1,
  label: 'จันทร์'
}, {
  day: 2,
  label: 'อังคาร'
}, {
  day: 3,
  label: 'พุธ'
}, {
  day: 4,
  label: 'พฤหัสบดี'
}, {
  day: 5,
  label: 'ศุกร์'
}, {
  day: 6,
  label: 'เสาร์'
}];

var MonthlyBodyContext = /*#__PURE__*/React__default.createContext({});
function useMonthlyBody() {
  return React.useContext(MonthlyBodyContext);
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
      return !omitDays.includes(dateFns.getDay(day));
    });
  } // omit the padding if an omitted day was before the start of the month


  var firstDayOfMonth = dateFns.getDay(daysToRender[0]);

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
      holiday = _ref2.holiday,
      context = _ref2.context,
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
  return React__default.createElement("div", {
    className: "bg-white border-l-2 border-t-2"
  }, React__default.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 " + //@ts-ignore
    headingClasses["l" + headings.length]
  }, headings.map(function (day) {
    return React__default.createElement("div", {
      key: day.day,
      className: headingClassName,
      "aria-label": "Day of Week"
    }, day.label);
  }), padding.map(function (_, index) {
    return React__default.createElement("div", {
      key: index,
      className: headingClassName,
      "aria-label": "Empty Day"
    });
  }), daysToRender.map(function (day) {
    return React__default.createElement(MonthlyBodyContext.Provider, {
      key: day.toISOString(),
      value: {
        day: day,
        events: events.filter(function (data) {
          return dateFns.isSameDay(data.date, day);
        }),
        holiday:holiday,
        context:context
      }
    }, children);
  })));
}
function MonthlyDay(_ref3) {
  var renderDay = _ref3.renderDay;

  var _useMonthlyBody = useMonthlyBody(),
      day = _useMonthlyBody.day,
      h = _useMonthlyBody.holiday,
      context = _useMonthlyBody.context,
      events = _useMonthlyBody.events;

  var dayNumber = dateFns.format(day, 'd');
  var monthNumber = dateFns.format(day, 'M');
  var yearNumber = dateFns.format(day, 'yyyy');
  var holiday = ""
  for(let d of h){
    if(d.date.split("/")[0] === dayNumber &&d.date.split("/")[1] === monthNumber  && d.date.split("/")[2] === yearNumber ){

      holiday = d
    }
  }
  return React__default.createElement("div", {
    "aria-label": "Events for day " + dayNumber,
    onContextMenu: context,
    id:holiday === ""?"context-menu":"context-menu-holiday",
    className: holiday === ""?"h-48 border-b-2 border-r-2":"h-48 border-b-2 border-r-2 holiday"
  }, React__default.createElement("div", { 
    onContextMenu: context,
    id:holiday === ""?"context-menu":"context-menu-holiday",
    className: "flex justify-between pt-2 pl-2"
  }, React__default.createElement("div", {
    onContextMenu: context,
    id:holiday === ""?"context-menu":"context-menu-holiday",
    className: ""
  }, dayNumber), React__default.createElement("div", {
    onContextMenu: context,
    id:holiday === ""?"context-menu":"context-menu-holiday",
    className: "lg:hidden block"
  }, dateFns.format(day, 'EEEE') === "Sunday"?"อาทิตย์":dateFns.format(day, 'EEEE') === "Monday"?"จันทร์":dateFns.format(day, 'EEEE') === "Tuesday"?"อังคาร":dateFns.format(day, 'EEEE') === "Wednesday"?"พุธ":dateFns.format(day, 'EEEE') === "Thursday"?"พฤหัสบดี":dateFns.format(day, 'EEEE') === "Friday"?"ศุกร์":"เสาร์")),
    holiday === ""?React__default.createElement("ul", {
    
    className: "divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto"
  }, renderDay(events)):React__default.createElement("label", {
    onContextMenu: context,
    id:holiday === ""?"context-menu":"context-menu-holiday",
    className: "max-h-36 w-100 text-center mt-3"
  }, holiday.name));
}

var DefaultMonthlyEventItem = function DefaultMonthlyEventItem(_ref) {
  var subject = _ref.subject;
  return React__default.createElement("li", {
    className: "",
  }, subject);
};

var WeeklyContext = /*#__PURE__*/React__default.createContext({});
var useWeeklyCalendar = function useWeeklyCalendar() {
  return React.useContext(WeeklyContext);
};
var WeeklyCalendar = function WeeklyCalendar(_ref) {
  var week = _ref.week,
  // holiday = _ref.holiday,
      children = _ref.children;

  var _useState = React.useState(),
      selectedDay = _useState[0],
      setSelectedDay = _useState[1]; //clear the selected day if the week changes


  React.useEffect(function () {
    setSelectedDay(undefined);
  }, [week]);
  return React__default.createElement(WeeklyContext.Provider, {
    value: {
      selectedDay: selectedDay,
      week: dateFns.startOfWeek(week),
      changeSelectedDay: setSelectedDay
    }
  }, children);
};
var WeeklyContainer = function WeeklyContainer(_ref2) {
  var children = _ref2.children;
  return React__default.createElement("div", {
    className: "md:flex md:justify-between"
  }, children);
};

var DayButton = function DayButton(_ref3) {
  var day = _ref3.day;

  var _useWeeklyCalendar = useWeeklyCalendar(),
      week = _useWeeklyCalendar.week,
      selectedDay = _useWeeklyCalendar.selectedDay,
      changeSelectedDay = _useWeeklyCalendar.changeSelectedDay;

  var isSelected = selectedDay ? dateFns.getDay(selectedDay) === day.day : false;
  var currentDate = dateFns.setDay(week, day.day);
  return React__default.createElement("li", {
    onClick: function onClick() {
      return changeSelectedDay(isSelected ? undefined : currentDate);
    },
    className: "bg-white cursor-pointer",
    "aria-label": "Day of Week"
  }, React__default.createElement("div", {
    className: "rounded-lg border sm:w-36 text-center py-4 " + (isSelected ? 'border-indigo-600' : 'border-gray-300 hover:border-gray-500')
  }, React__default.createElement("p", {
    className: "font-medium text-sm text-gray-800"
  }, day.label, " ", dateFns.format(currentDate, 'do'))));
};

var WeeklyDays = function WeeklyDays(_ref4) {
  var omitDays = _ref4.omitDays;
  var daysToRender = daysInWeek;

  if (omitDays) {
    daysToRender = daysInWeek.filter(function (day) {
      return !omitDays.includes(day.day);
    });
  }

  return React__default.createElement("ul", {
    className: "grid md:grid-cols-1 grid-cols-2 gap-2"
  }, daysToRender.map(function (day) {
    return React__default.createElement(DayButton, {
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

  return React__default.createElement("div", {
    className: "overflow-auto max-h-96",
    style: style
  }, React__default.createElement("ul", {
    className: "divide-y divide-gray-200 "
  }, events.map(function (item) {
    // If they select a single day, filter out events for different days
    if (selectedDay) {
      if (!dateFns.isSameDay(selectedDay, item.date)) return null;
    } //if an event is for a different week, filter it out


    if (!dateFns.isSameWeek(week, item.date)) return null; //return the remeaining events!

    return renderItem({
      item: item,
      showingFullWeek: selectedDay === undefined
    });
  })));
}
var WeeklyResponsiveContainer = function WeeklyResponsiveContainer(_ref6) {
  var children = _ref6.children;
  return React__default.createElement("div", {
    className: "border p-4 md:w-3/4 lg:w-1/2 w-full"
  }, children);
};

var DefaultWeeklyEventItem = function DefaultWeeklyEventItem(_ref) {
  var title = _ref.title,
      date = _ref.date;
  return React__default.createElement("li", {
    className: "py-4 w-72"
  }, React__default.createElement("div", {
    className: "text-sm flex justify-between"
  }, React__default.createElement("h3", {
    className: "font-medium"
  }, title), React__default.createElement("p", {
    className: "text-gray-500"
  }, date)));
};

exports.DefaultMonthlyEventItem = DefaultMonthlyEventItem;
exports.DefaultWeeklyEventItem = DefaultWeeklyEventItem;
exports.MonthlyBody = MonthlyBody;
exports.MonthlyCalendar = MonthlyCalendar;
exports.MonthlyDay = MonthlyDay;
exports.MonthlyNav = MonthlyNav;
exports.WeeklyBody = WeeklyBody;
exports.WeeklyCalendar = WeeklyCalendar;
exports.WeeklyContainer = WeeklyContainer;
exports.WeeklyDays = WeeklyDays;
exports.WeeklyResponsiveContainer = WeeklyResponsiveContainer;
exports.handleOmittedDays = handleOmittedDays;
exports.useMonthlyBody = useMonthlyBody;
exports.useMonthlyCalendar = useMonthlyCalendar;
exports.useWeeklyCalendar = useWeeklyCalendar;
//# sourceMappingURL=react-calendar.cjs.development.js.map
