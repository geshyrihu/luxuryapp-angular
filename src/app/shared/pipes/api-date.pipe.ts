import { Pipe, PipeTransform, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DateService } from "../../core/services/date.service";

@Pipe({
  name: "apiDate",
})
export class ApiDatePipe implements PipeTransform {
  constructor(
    private readonly dateService: DateService = inject(DateService),
    private readonly datePipe: DatePipe = inject(DatePipe),
  ) {}

  transform(
    value: string | Date | null | undefined,
    format: string = "dd/MM/yyyy",
  ): string | null {
    const date = this.toDate(value);
    if (!date) {
      return null;
    }
    return this.datePipe.transform(date, format);
  }

  private toDate(value: string | Date | null | undefined): Date | null {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      const isPureDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(normalized);
      if (isPureDateOnly) {
        return this.dateService.parseDate(normalized);
      }
      const parsed = new Date(normalized);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
}
