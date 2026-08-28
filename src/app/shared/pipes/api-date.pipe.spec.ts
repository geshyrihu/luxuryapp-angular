import { ApiDatePipe } from "./api-date.pipe";
import { DateService } from "../../core/services/date.service";
import { DatePipe, registerLocaleData } from "@angular/common";
import localeEsMx from "@angular/common/locales/es-MX";

registerLocaleData(localeEsMx);


describe("ApiDatePipe", () => {
  const dateService = new DateService();
  const datePipe = new DatePipe("es-MX");
  const pipe = new ApiDatePipe(dateService, datePipe);

  it("debe formatear un DateOnly sin hora como el día correcto (no un día menos)", () => {
    const result = pipe.transform("2026-08-26");
    expect(result).toBe("26/08/2026");
  });

  it("debe preservar el día calendario de México para un DateTime UTC con Z (caso 2)", () => {
    const result = pipe.transform("2026-08-27T02:00:00Z");
    expect(result).toBe("26/08/2026");
  });

  it("debe confirmar que un DateOnly puro sigue dando el día vía DateService.parseDate", () => {
    const result = pipe.transform("2026-08-26");
    expect(result).toBe("26/08/2026");
  });

  it("debe devolver null para null, undefined y cadena vacía sin lanzar", () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
    expect(pipe.transform("")).toBeNull();
  });

  it("debe respetar un formato personalizado", () => {
    const result = pipe.transform("2026-08-26", "dd-MMM-yy");
    expect(result).toMatch(/26-ago-26/);
  });

  it("debe funcionar con un valor ya Date", () => {
    const result = pipe.transform(new Date(2026, 7, 26));
    expect(result).toBe("26/08/2026");
  });
});
