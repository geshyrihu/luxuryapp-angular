import { Directive, computed, model } from "@angular/core";

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface PresetRange {
  label: string;
  getValue: () => { start: Date; end: Date };
}

/**
 * Base compartida de DateRange (API + presets + validación).
 *  - web:     `app-date-range` (presets con p-button)
 *  - mobile:  `ili-date-range` (presets con ion-button)
 *  - wrapper: `lx-date-range`  (auto runtime)
 * Ambas versiones usan `<input type="date">` nativo (picker nativo en móvil).
 */
@Directive()
export abstract class DateRangeBase {
  value = model<DateRangeValue>({ start: null, end: null });

  error = computed(() => {
    const { start, end } = this.value();
    if (start && end && start > end) {
      return "La fecha de inicio debe ser anterior a la fecha de fin.";
    }
    return null;
  });

  readonly presets: PresetRange[] = [
    {
      label: "Hoy",
      getValue: () => {
        const d = new Date();
        return { start: d, end: d };
      },
    },
    {
      label: "Esta semana",
      getValue: () => {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        return { start, end: now };
      },
    },
    {
      label: "Este mes",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start, end: now };
      },
    },
    {
      label: "Últimos 30 días",
      getValue: () => {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - 30);
        return { start, end: now };
      },
    },
    {
      label: "Este año",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return { start, end: now };
      },
    },
  ];

  toInputDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  onStartChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.value ? new Date(input.value + "T00:00:00") : null;
    this.value.set({ start: date, end: this.value().end });
  }

  onEndChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.value ? new Date(input.value + "T00:00:00") : null;
    this.value.set({ start: this.value().start, end: date });
  }

  applyPreset(preset: PresetRange): void {
    this.value.set(preset.getValue());
  }
}
