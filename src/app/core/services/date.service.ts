import { Injectable } from "@angular/core";
// Creamos una instancia de la fecha actual
const dateNow = new Date();

@Injectable({
  providedIn: "root",
})
export class DateService {
  /**
   * Obtiene la fecha actual en formato 'AAAA-MM-DD'.
   * @returns Fecha actual en formato 'AAAA-MM-DD'.
   */
  getDateNow(): string {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dayS: any = day;
    let monthS: any = month;

    // Formateamos el día y el mes con ceros a la izquierda si son menores a 10
    if (month < 10) {
      monthS = `0${month}`;
    }
    if (day < 10) {
      dayS = `0${day}`;
    }

    return `${year}-${monthS}-${dayS}`;
  }

  /**
   * Obtiene la fecha en formato 'AAAA-MM-DD' a partir de una fecha.
   * @param value Fecha a formatear.
   * @returns Fecha en formato 'AAAA-MM-DD'.
   */
  getDateFormat(value: Date): string {
    if (value === null || value === undefined) {
      return null;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null; // Validar fechas inválidas
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene la hora actual en formato 'HH:MM'.
   * @param date Fecha de la que se obtendrá la hora.
   * @returns Hora actual en formato 'HH:MM'.
   */
  getHoraNow(date: Date): string {
    let hora = date.getHours();
    let minutos = date.getMinutes();

    let horaReturn: string | number;
    let minutoreturn: string | number;

    // Formateamos la hora y los minutos con ceros a la izquierda si son menores a 10
    if (hora < 10) {
      horaReturn = `0${hora}`;
    } else {
      horaReturn = hora;
    }
    if (minutos < 10) {
      minutoreturn = `0${minutos}`;
    } else {
      minutoreturn = minutos;
    }

    return `${horaReturn}:${minutoreturn}`;
  }

  /**
   * Obtiene la fecha en formato 'HH:MM' a partir de una fecha en formato string.
   * @param date Fecha en formato string.
   * @returns Fecha en formato 'HH:MM'.
   */
  getDateString(date: string): string {
    let newDate = new Date(date);
    return this.getHoraNow(newDate);
  }

  /**
   * Obtiene el año actual.
   * @returns Año actual.
   */
  getFullYear(): number {
    return dateNow.getFullYear();
  }

  /**
   * Formatea una fecha y hora en formato 'AAAA-MM-DDTHH:MM:SS'.
   * @param date Fecha y hora a formatear.
   * @returns Fecha y hora formateada.
   */
  formatDateTime(date: Date): string {
    if (date === null) {
      return null;
    } else {
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
  }

  /**
   * Formatea una fecha en formato 'MM-AAAA' a partir de una fecha.
   * @param date Fecha a formatear.
   * @returns Fecha en formato 'MM-AAAA'.
   */
  formatDateTimeToMMAAAA(date: Date): string {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);

      const format = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
      });
      const [{ value: month }, , { value: year }] = format.formatToParts(date);

      return `${month}-${year}`;
    }
  }
  /**
   * Formatea una fecha en formato 'MMMM-AAAA' en mayúsculas a partir de una fecha.
   * @param date Fecha a formatear.
   * @returns Fecha en formato 'MMMM-AAAA' en mayúsculas.
   */
  formatDateTimeToMMMMAAAA(date: Date): string {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat("es-Mx", {
        year: "numeric",
        month: "long",
      });
      const fechaFormateada = format.format(date);
      return fechaFormateada.toUpperCase();
    }
  }

  /**
   * Convierte una fecha en formato 'AAAA-MM-DD' a 'DD-MM-AAAA'.
   * @param date Fecha en formato 'AAAA-MM-DD'.
   * @returns Fecha en formato 'DD-MM-AAAA'.
   */
  formDateToStringLocale(date: Date): string {
    if (date === null) {
      return null;
    } else {
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
  }

  /**
   * Convierte un valor de fecha (string o Date) a formato 'YYYY-MM-DD'.
   * @param value El valor de fecha a formatear.
   * @returns La fecha en formato 'YYYY-MM-DD' o null si el valor es inválido.
   */
  formatToYyyyMmDd(value: any): string {
    if (!value) {
      return null;
    }

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string") {
      const partsSlash = value.split("/");
      const partsPipe = value.split(" | ");

      if (partsSlash.length === 3) {
        // Formato dd/MM/yyyy
        date = new Date(
          parseInt(partsSlash[2]),
          parseInt(partsSlash[1]) - 1,
          parseInt(partsSlash[0]),
        );
      } else if (partsPipe.length === 3) {
        // Formato dd | MM | yyyy
        date = new Date(
          parseInt(partsPipe[2]),
          parseInt(partsPipe[1]) - 1,
          parseInt(partsPipe[0]),
        );
      } else {
        // Intentar parsear como ISO string u otro formato nativo
        date = new Date(value);
      }
    } else {
      return null; // No es un tipo soportado
    }

    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return null; // Fecha inválida
  }

  /**
   * Obtiene el nombre del mes y el año a partir de una fecha en formato 'MMMM-AAAA'.
   * @param date Fecha en formato 'MMMM-AAAA'.
   * @returns Nombre del mes y el año.
   */
  getNameMontYear(date: Date): string {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "long",
      });
      const [{ value: month }, , { value: year }] = format.formatToParts(date);

      return `${month}-${year}`;
    }
  }

  /**
   * Convierte una fecha en formato 'AAAA-MM' a 'AAAA-MM'.
   * @param date Fecha en formato 'AAAA-MM'.
   * @returns Fecha en formato 'AAAA-MM'.
   */
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









