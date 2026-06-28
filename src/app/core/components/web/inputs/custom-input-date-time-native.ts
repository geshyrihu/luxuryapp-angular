import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-date-time-native",
  imports: [BaseInputSignal, ReactiveFormsModule, FlatpickrDirective, InputTextModule],
  template: `
    <base-input-signal
      [label]="label()"
      [id]="id()"
      [control]="control()"
      [horizontal]="horizontal()"
      [required]="required()"
    >
      <div class="flex gap-2 w-full">
        <input
          pInputText
          mwlFlatpickr
          type="text"
          [id]="id()"
          [formControl]="dateControl"
          [enableTime]="false"
          [altInput]="true"
          [altFormat]="'d/M/Y'"
          [dateFormat]="'Y-m-d'"
          [allowInput]="true"
          class="flex-1 min-w-0"
          fluid
        />
        <input
          pInputText
          type="time"
          style="width: 10rem; flex-shrink: 0;"
          [value]="timePart()"
          (change)="onTimeChange($event)"
        />
      </div>
    </base-input-signal>
  `,
})
export class CustomInputDateTimeNative implements OnInit {
  control = input<FormControl>(new FormControl());
  id = input<string>(`dtn-${Math.random().toString(36).substring(2, 9)}`);
  label = input<string>("");
  horizontal = input<boolean>(true);
  required = input<boolean>(false);

  dateControl = new FormControl("");
  timePart = signal("");

  private readonly destroyRef = inject(DestroyRef);
  private syncing = false;

  ngOnInit(): void {
    this.syncFromControl();

    this.control()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.syncing) this.syncFromControl();
      });

    this.dateControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.syncing) this.emit();
      });
  }

  onTimeChange(event: Event): void {
    this.timePart.set((event.target as HTMLInputElement).value);
    this.emit();
  }

  private syncFromControl(): void {
    const val = this.control().value as string | null | undefined;
    if (!val) {
      this.dateControl.setValue("", { emitEvent: false });
      this.timePart.set("");
      return;
    }
    const clean = val.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
    const [datePart, timePart] = clean.split("T");
    this.dateControl.setValue(datePart?.slice(0, 10) || "", { emitEvent: false });
    this.timePart.set((timePart || "").slice(0, 5));
  }

  private emit(): void {
    const d = this.dateControl.value;
    const t = this.timePart();
    this.syncing = true;
    try {
      this.control().setValue(d ? `${d}T${t || "00:00"}` : null);
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    } finally {
      this.syncing = false;
    }
  }
}

