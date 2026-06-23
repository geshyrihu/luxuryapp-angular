import { Component, model, computed, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

interface PresetRange {
  label: string;
  getValue: () => { start: Date; end: Date };
}

@Component({
  selector: "app-date-range",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="date-range-root flex flex-column gap-2">
      <div class="flex gap-2 flex-wrap">
        @for (preset of presets; track preset.label) {
          <p-button
            [label]="preset.label"
            size="small"
            severity="secondary"
            [outlined]="true"
            (onClick)="applyPreset(preset)"
          />
        }
      </div>
      <div class="flex gap-2 align-items-center">
        <div class="flex flex-column flex-1">
          <label class="text-xs text-color-secondary mb-1">Desde</label>
          <input
            type="date"
            class="date-input"
            [value]="value().start ? toInputDate(value().start!) : ''"
            (input)="onStartChange($event)"
          />
        </div>
        <span class="text-color-muted mt-4">—</span>
        <div class="flex flex-column flex-1">
          <label class="text-xs text-color-secondary mb-1">Hasta</label>
          <input
            type="date"
            class="date-input"
            [value]="value().end ? toInputDate(value().end!) : ''"
            (input)="onEndChange($event)"
          />
        </div>
      </div>
      @if (error()) {
        <small class="text-danger">{{ error() }}</small>
      }
    </div>
  `,
  styles: [`
    .date-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--ds-border);
      border-radius: var(--ds-radius-input);
      background: var(--ds-bg-surface);
      color: var(--ds-text-primary);
      font-family: var(--ds-font-family-base);
      font-size: var(--ds-font-size-body);
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .date-input:focus {
      border-color: var(--ds-border-focus);
      box-shadow: var(--ds-shadow-focus);
    }
    .date-input:disabled {
      font-style: italic;
      cursor: not-allowed;
      opacity: 0.55;
      background: var(--ds-bg-sunken);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class DateRange {
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
