import { signal } from "@angular/core";

export const reportFilterState = {
  year: signal<number>(new Date().getFullYear()),
  mesIdx: signal<number>(Math.max(2, new Date().getMonth() - 1)),
  currentReportName: signal<string>(""),
  currentReportContext: signal<string>(""),
};
