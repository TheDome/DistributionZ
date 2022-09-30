import MonthData from "@/ipc/model/MonthData";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { APIContext } from "../api/Api";
import CalendarContent from "../CalendarContent";

export default function CalendarFunc({
  onChangeDate,
  cacheKey,
}: {
  onChangeDate: (date: Date) => void;
  cacheKey: any;
}) {
  const [slicesToQuery, setSlicesToQuery] = useState<
    { month: number; year: number }[]
  >([]);
  const [data, setData] = useState<{ key: string; value: MonthData }[]>([]);

  const api = useContext(APIContext);

  useEffect(() => {
    // Query the data
    const newData = slicesToQuery.map(async (slice) => {
      const value = await api.getMonthData(slice.month, slice.year);
      return { key: slice.year + "-" + slice.month, value };
    });

    // Set the data
    Promise.all(newData).then((newData) => {
      setData(newData);
    });
  }, [slicesToQuery]);

  useEffect(() => {
    // Clear the cache

    setData([]);
    setSlicesToQuery([]);
  }, [cacheKey]);

  return (
    <Calendar
      onChange={(date: Date, _event: ChangeEvent) => {
        onChangeDate(date as Date);
      }}
      tileContent={(el) => {
        if (el.view === "month") {
          if (
            slicesToQuery.findIndex(
              (slice) =>
                slice.month === el.date.getMonth() &&
                slice.year === el.date.getFullYear()
            ) === -1
          ) {
            setSlicesToQuery([
              ...slicesToQuery,
              { month: el.date.getMonth(), year: el.date.getFullYear() },
            ]);
          } else {
            const sliceData = data.find(
              (data) =>
                data.key ==
                el.date.getUTCFullYear() + "-" + el.date.getUTCMonth()
            )?.value?.entries;

            if (sliceData) {
              const key = new Date(
                el.date.getUTCFullYear(),
                el.date.getUTCMonth(),
                el.date.getUTCDate() + 2
              )
                .toISOString()
                .split("T")[0];

              const entry = sliceData[key];

              if (entry) {
                return <CalendarContent data={entry} />;
              }
            }
          }
        }
        return <div></div>;
      }}
    />
  );
}
