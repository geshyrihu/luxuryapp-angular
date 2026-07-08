import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "initialsAbbr",
})
export class InitialsAbbrPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return "";
    return value
      .split(" ")
      .filter((w) => w.length > 0)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
}
