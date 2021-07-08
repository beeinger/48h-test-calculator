import React, { useEffect, useRef, useState } from "react";

import styled from "styled-components";

const DateTimeStyle = styled.form`
  margin-top: 8px;
  max-width: 200px;
  justify-content: center;

  display: grid;
  grid-template-columns: 1fr 0.25fr 1fr 0.25fr 1.2fr 1fr 1fr 0.25fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: "day daygap month monthgap year yeargap hour hourgap minute";
`;
DateTimeStyle.displayName = "DateTimeStyle";

const Input = styled.input`
  min-width: 55px;
  -moz-appearance: textfield;
  appearance: none;
  margin: 0;
  background: none;
  border: none;

  text-align: center;

  color: ${({ theme }) => theme.main};
  ${({ theme }) => theme.font.secondary}

  :focus {
    outline: none;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
`;
Input.displayName = "Input";

const Day = styled(Input)`
  grid-area: day;
`;
Day.displayName = "Day";

const Month = styled(Input)`
  grid-area: month;
`;
Month.displayName = "Month";

const Year = styled(Input)`
  grid-area: year;
`;
Year.displayName = "Year";

const Hour = styled(Input)`
  grid-area: hour;
`;
Hour.displayName = "Hour";

const Space = styled(Input)`
  grid-area: ${({ gap }) => gap + "gap"};
  min-width: 3px;
  ${({ gap, language }) =>
    (gap === "month") | (gap === "hour" && language === "pl")
      ? "margin-right: -2px"
      : "margin-left: -6px"};
`;
Space.displayName = "Space";

const Minute = styled(Input)`
  grid-area: minute;
`;
Minute.displayName = "Minute";

const dictionary = {
  en: {
    day: "day",
    month: "month",
    year: "year",
    hour: "hour",
    minute: "minute",
  },
  pl: {
    day: "dzień",
    month: "miesiąc",
    year: "rok",
    hour: "godzina",
    minute: "minuta",
  },
};

export default function DateTime({ callback, language }) {
  const [day, setDay] = useState(""),
    [month, setMonth] = useState(""),
    [year, setYear] = useState("2021"),
    [hour, setHour] = useState(""),
    [minute, setMinute] = useState("");

  const dayRef = useRef(null),
    monthRef = useRef(null),
    yearRef = useRef(null),
    hourRef = useRef(null),
    minuteRef = useRef(null);

  const refs = [dayRef, monthRef, yearRef, hourRef, minuteRef];

  const get0Prefix = (value) => (value.length === 2 ? value : "0" + value);

  const handleDay = (e) => {
      const newValue = e.target.value;
      if ((newValue === "") | (Number(newValue) > 0 && Number(newValue) < 32)) {
        setDay(newValue);
        (Number(newValue) >= 3) | (newValue.length === 2) &&
          monthRef?.current.focus();
      }
    },
    handleMonth = (e) => {
      const newValue = e.target.value;
      if ((newValue === "") | (Number(newValue) > 0 && Number(newValue) < 13)) {
        setMonth(newValue);
        (newValue !== "1") | (newValue.length === 2) &&
          hourRef?.current.focus();
      }
    },
    handleYear = (e) => {
      const newValue = e.target.value;
      (newValue === "202") |
        (Number(newValue) > 2020 && Number(newValue) < 2030) &&
        setYear(newValue);
    },
    handleHour = (e) => {
      const newValue = e.target.value;
      if (
        (newValue === "") |
        (Number(newValue) > 0 && Number(newValue) <= 24)
      ) {
        setHour(newValue);
        (Number(newValue) >= 2) | (newValue.length === 2) &&
          minuteRef?.current.focus();
      }
      if (newValue === "0")
        if (hour === "") {
          setHour("00");
          newValue.length === 2 && minuteRef?.current.focus();
        } else setHour("");
    },
    handleMinute = (e) => {
      const newValue = e.target.value;
      if (newValue.length > 2) return;
      if (
        (newValue === "") |
        (Number(newValue) >= 0 && Number(newValue) <= 60)
      ) {
        setMinute(newValue);
        (Number(newValue) >= 5) | (newValue.length === 2) &&
          minuteRef?.current.blur();
      }
      newValue === "0" && minute !== "" && setMinute("");
    };

  const handleSubmit = (e) => {
    if (e.keyCode !== 13) return;
    let index;
    for (let ref in refs)
      if (refs[ref]?.current.contains(e.target)) {
        index = Number(ref);
        break;
      }
    index <= refs.length - 2
      ? refs[index + 1]?.current.focus()
      : refs[index]?.current.blur();
  };

  useEffect(() => {
    if (
      !(
        day.length >= 1 &&
        month.length >= 1 &&
        year.length === 4 &&
        hour.length >= 1 &&
        minute.length >= 1
      )
    ) {
      callback(false);
      return;
    }

    const dateString = `${year}-${get0Prefix(month)}-${get0Prefix(
        day
      )}T${get0Prefix(hour)}:${get0Prefix(minute)}:00`,
      date = new Date(dateString);

    if (date) {
      callback(date.getTime());
    }
  }, [day, month, year, hour, minute]);

  return (
    <DateTimeStyle onKeyDown={handleSubmit}>
      <Day
        placeholder={dictionary[language].day}
        ref={dayRef}
        value={day}
        onChange={handleDay}
        type="number"
        min="1"
        max="31"
        step="1"
      />
      <Space placeholder="." gap="day" disabled />
      <Month
        placeholder={dictionary[language].month}
        ref={monthRef}
        value={month}
        onChange={handleMonth}
        type="number"
        min="1"
        max="12"
        step="1"
      />
      <Space placeholder="." gap="month" disabled />
      <Year
        placeholder={dictionary[language].year}
        ref={yearRef}
        value={year}
        onChange={handleYear}
        type="number"
        min="2021"
        max="2029"
        step="1"
      />
      <Space placeholder="," gap="year" disabled />
      <Hour
        placeholder={dictionary[language].hour}
        ref={hourRef}
        value={hour}
        onChange={handleHour}
        type="number"
        min="00"
        max="24"
        step="1"
      />
      <Space placeholder=":" gap="hour" language={language} disabled />
      <Minute
        placeholder={dictionary[language].minute}
        ref={minuteRef}
        value={minute}
        onChange={handleMinute}
        type="number"
        min="00"
        max="60"
        step="5"
      />
    </DateTimeStyle>
  );
}
