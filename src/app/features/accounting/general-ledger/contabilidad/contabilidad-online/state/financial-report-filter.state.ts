import { signal } from "@angular/core";

export const reportFilterState = {
  year: signal<number>(new Date().getFullYear()),
  mesIdx: signal<number>(Math.max(2, new Date().getMonth() - 1)),
  refreshTick: signal<number>(0),
  currentReportName: signal<string>(""),
  currentReportContext: signal<string>(""),
};
