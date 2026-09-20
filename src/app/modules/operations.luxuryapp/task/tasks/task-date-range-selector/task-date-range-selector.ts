import { Component, OnInit, output, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { DateRangeStorageService } from "../date-range-storage.service";
@Component({
  selector: "app-task-date-range-selector",
  templateUrl: "./task-date-range-selector.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputDateSignal, WebButtonLabelItem],
})
export class TaskDateRangeSelector implements OnInit {
  constructor(private dateRangeStorageService: DateRangeStorageService) {}

  // Modificamos la declaración de dateRange para que use un objeto con from y to
  dateRangeControl = new FormControl<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  ngOnInit(): void {
    // Recuperar las fechas guardadas cuando el componente se inicializa
    const savedDateRange = this.dateRangeStorageService.getDateRange();
    if (savedDateRange.from && savedDateRange.to) {
      this.dateRangeControl.setValue(savedDateRange, { emitEvent: false });
      this.emitSelectedDates(); // Emitir los valores recuperados
    }
  }

  selectedDates = output<{ startDate: Date; endDate: Date }>();

  onDateChange(dates: { from: Date | null; to: Date | null }) {
    this.dateRangeControl.setValue(dates, { emitEvent: false });
  }

  emitSelectedDates() {
    const range = this.dateRangeControl.value;
    // Comprobamos que las fechas from y to no sean nulas
    if (range?.from && range?.to) {
      this.selectedDates.emit({
        startDate: range.from,
        endDate: range.to,
      });
      // Guardar las fechas seleccionadas
      this.dateRangeStorageService.saveDateRange(range.from, range.to);
    }
  }
}
