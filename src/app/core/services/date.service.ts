import { Injectable } from "@angular/core";

const dateNow = new Date();

@Injectable({
  providedIn: "root",
})
export class DateService {
  private parseDatePreservingLocalDay(value: any): Date | null {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim();
      const isoDateMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (isoDateMatch) {
        const [, year, month, day] = isoDateMatch;
        const parsedDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        );
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      }

      const parsedDate = new Date(normalizedValue);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    const parsedDate = new Date(value);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  getDateNow(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  getDateFormat(value: any): string {
    const date = this.parseDatePreservingLocalDay(value);
    if (!date) {
      return null;
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  parseDate(value: any): Date | null {
    return this.parseDatePreservingLocalDay(value);
  }

  getHoraNow(date: Date): string {
    const hora = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");

    return `${hora}:${minutos}`;
  }

  getDateString(date: string): string {
    const newDate = new Date(date);
    return this.getHoraNow(newDate);
  }

  getFullYear(): number {
    return dateNow.getFullYear();
  }

  formatDateTime(date: Date): string {
    if (date === null) {
      return null;
    }

    date = new Date(date);
    const format = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
      ,
      { value: hour },
      ,
      { value: minute },
      ,
      { value: second },
    ] = format.formatToParts(date);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  formatDateTimeToMMAAAA(date: Date): string {
    if (date === null) {
      return null;
    }

    date = new Date(date);
    const format = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
    });
    const [{ value: month }, , { value: year }] = format.formatToParts(date);

    return `${month}-${year}`;
  }

  formatDateTimeToMMMMAAAA(date: Date): string {
    if (date === null) {
      return null;
    }

    date = new Date(date);
    const format = new Intl.DateTimeFormat("es-Mx", {
      year: "numeric",
      month: "long",
    });
    const fechaFormateada = format.format(date);
    return fechaFormateada.toUpperCase();
  }

  formDateToStringLocale(date: Date): string {
    if (date === null) {
      return null;
    }

    date = new Date(date);
    const format = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [{ value: month }, , { value: day }, , { value: year }] =
      format.formatToParts(date);

    return `${day}-${month}-${year}`;
  }

  formatToYyyyMmDd(value: any): string {
    if (!value) {
      return null;
    }

    let date: Date | null;

    if (typeof value === "string") {
      const partsSlash = value.split("/");
      const partsPipe = value.split(" | ");

      if (partsSlash.length === 3) {
        date = new Date(
          parseInt(partsSlash[2]),
          parseInt(partsSlash[1]) - 1,
          parseInt(partsSlash[0]),
        );
      } else if (partsPipe.length === 3) {
        date = new Date(
          parseInt(partsPipe[2]),
          parseInt(partsPipe[1]) - 1,
          parseInt(partsPipe[0]),
        );
      } else {
        date = this.parseDatePreservingLocalDay(value);
      }
    } else {
      date = this.parseDatePreservingLocalDay(value);
    }

    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return null;
  }

  getNameMontYear(date: Date): string {
    if (date === null) {
      return null;
    }

    date = new Date(date);
    const format = new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
    });
    const [{ value: month }, , { value: year }] = format.formatToParts(date);

    return `${month}-${year}`;
  }

  onParseToInputMonth(date: Date): string {
    const mm = date.getMonth() + 1;
    return [date.getFullYear(), (mm > 9 ? "" : "0") + mm].join("-");
  }

  parsearErroresAPI(response: any): string[] {
    const resultado: string[] = [];

    if (response.error) {
      if (typeof response.error === "string") {
        resultado.push(response.error);
      } else {
        const mapaErrores = response.error.errors;
        const entradas = Object.entries(mapaErrores);
        entradas.forEach((arreglo: any[]) => {
          const campo = arreglo[0];
          arreglo[1].forEach((mensajeError) => {
            resultado.push(`${campo}: ${mensajeError}`);
          });
        });
      }
    }

    return resultado;
  }
}
