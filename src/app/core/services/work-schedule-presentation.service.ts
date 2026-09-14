import { Injectable } from "@angular/core";

export interface WorkScheduleDaySource {
  diaSemana?: number;
  numeroSemanaCiclo?: number;
  horaEntrada: string | null;
  horaSalida: string | null;
  esDescanso?: boolean;
}

export interface WorkScheduleSource {
  duracionCicloSemanas?: number | null;
  diasDeTrabajo?: WorkScheduleDaySource[] | null;
}

export interface WorkScheduleDayIndicator {
  label: string;
  worked: boolean;
  text: string;
  tooltip: string;
  overnight: boolean;
}

@Injectable({ providedIn: "root" })
export class WorkSchedulePresentationService {
  private readonly days = [
    { label: "LUN", value: 1 },
    { label: "MAR", value: 2 },
    { label: "MIÉ", value: 3 },
    { label: "JUE", value: 4 },
    { label: "VIE", value: 5 },
    { label: "SÁB", value: 6 },
    { label: "DOM", value: 0 },
  ] as const;

  indicators(source: WorkScheduleSource): WorkScheduleDayIndicator[] {
    return this.days.map((day) => {
      const normalizedDay = source.diasDeTrabajo?.find(
        (item) => item.numeroSemanaCiclo === 1 && item.diaSemana === day.value,
      );
      const entry = normalizedDay?.horaEntrada ?? null;
      const exit = normalizedDay?.horaSalida ?? null;
      const worked = !normalizedDay?.esDescanso && (!!entry || !!exit);
      
      let overnight = false;
      if (worked && entry && exit) {
        overnight = this.toMinutes(exit) < this.toMinutes(entry);
      } else if (worked && entry && !exit) {
        overnight = true;
      }

      let text = "Descanso";
      if (worked) {
        if (entry && exit) text = `${this.formatTime(entry)}-${this.formatTime(exit)}${overnight ? " +1" : ""}`;
        else if (entry && !exit) text = `${this.formatTime(entry)}-... +1`;
        else if (!entry && exit) text = `...-${this.formatTime(exit)}`;
      }

      return {
        label: day.label,
        worked,
        text,
        tooltip: worked ? `${day.label} ${text}` : `${day.label} descanso`,
        overnight,
      };
    });
  }

  hoursSummary(source: WorkScheduleSource): string {
    const weeklyHours = this.weeklyAverageHours(source);
    return `Sem: ${this.formatHours(weeklyHours)} · Quin: ${this.formatHours(weeklyHours * 2)} · 4 sem: ${this.formatHours(weeklyHours * 4)}`;
  }

  weeklyAverageHours(source: WorkScheduleSource): number {
    const days = source.diasDeTrabajo?.length
      ? source.diasDeTrabajo
      : this.days.map((day) => ({
          horaEntrada: null,
          horaSalida: null,
          esDescanso: false,
          numeroSemanaCiclo: 1,
        }));

    const cycleWeeks =
      source.duracionCicloSemanas ||
      Math.max(...days.map((day) => day.numeroSemanaCiclo ?? 1), 1);
    const totalHours = days.reduce(
      (total, day) =>
        total +
        this.hoursBetween(day.horaEntrada, day.horaSalida, !!day.esDescanso),
      0,
    );

    return totalHours / cycleWeeks;
  }

  private hoursBetween(
    entry: string | null,
    exit: string | null,
    isRestDay: boolean,
  ): number {
    if (isRestDay) return 0;
    if (!entry && !exit) return 0;

    if (entry && exit) {
      const entryMinutes = this.toMinutes(entry);
      const exitMinutes = this.toMinutes(exit);
      if (exitMinutes > entryMinutes) {
        return (exitMinutes - entryMinutes) / 60;
      } else if (exitMinutes < entryMinutes) {
        const minutesToMidnight = (24 * 60) - entryMinutes;
        return (minutesToMidnight + exitMinutes) / 60;
      }
      return 0; // if equal
    } else if (entry && !exit) {
      const entryMinutes = this.toMinutes(entry);
      return ((24 * 60) - entryMinutes) / 60;
    } else if (!entry && exit) {
      const exitMinutes = this.toMinutes(exit);
      return exitMinutes / 60;
    }
    return 0;
  }

  private toMinutes(value: string | null): number {
    if (!value) return 0;
    const [hours, minutes] = this.formatTime(value).split(":").map(Number);
    return hours * 60 + minutes;
  }

  private formatTime(value: string | null): string {
    return value ? value.slice(0, 5) : "";
  }

  private formatHours(value: number): string {
    return `${Number.isInteger(value) ? value : value.toFixed(1)} h`;
  }
}
