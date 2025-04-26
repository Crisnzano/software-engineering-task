"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update: [Date | null, Date | null]) => {
        setStartDate(update[0]);
        setEndDate(update[1]);
      }}
      isClearable
      className="border border-gray-300 p-2 rounded-md"
    />
  );
}
