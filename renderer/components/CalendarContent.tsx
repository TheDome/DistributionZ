import MonthData from "@/ipc/model/MonthData";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export default function CalendarContent({
  data,
}: {
  data: MonthData["entries"][string];
}) {
  // Return a bullet

  const blocked = data.blocked;
  const shift = data.shift;

  let bullet = "•";

  return <div>{blocked || shift ? bullet : ""}</div>;
}
