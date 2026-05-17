import { formatNumber } from "@angular/common";
import { Pipe } from "@angular/core";

@Pipe({
  name: "accountingNumber",
})
export class AccountingNumberPipe {
  transform(
    value: number | null | undefined,
    digitsInfo = "1.0-0",
  ): string {
    if (value === null || value === undefined) {
      return "";
    }

    const formatted = formatNumber(Math.abs(value), "es-MX", digitsInfo);

    return value < 0 ? `(${formatted})` : formatted;
  }
}
