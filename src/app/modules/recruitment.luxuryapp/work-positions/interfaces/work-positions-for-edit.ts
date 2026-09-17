import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { WorkPositionService } from './work-position.service';
import { WorkDayForm, WorkPositionScheduleForm } from '../models/work-position-schedule-form.model';
import { WorkPositionScheduleDto } from '../models/work-position-schedule-dto.model';

type WorkDayControls = {
  id: FormControl<string>;
  diaSemana: FormControl<number>;
  numeroSemanaCiclo: FormControl<number>;
  horaEntrada: FormControl<string | null>;
  horaSalida: FormControl<string | null>;
  esDescanso: FormControl<boolean>;
};

type WorkDayGroup = FormGroup<WorkDayControls>;

const workDayValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.get('esDescanso')?.value) return null;
  const entry = control.get('horaEntrada')?.value as string | null;
  const exit = control.get('horaSalida')?.value as string | null;
  if (!entry && !exit) return { missingBothHours: true };
  if (entry && exit && entry === exit) return { invalidTimeOrder: true };
  return null;
};

const scheduleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const days = control.get('diasDeTrabajo') as FormArray<WorkDayGroup> | null;
  return days?.controls.some((day) => day.hasError('missingBothHours'))
    ? { incompleteWorkDay: true }
    : null;
};

@Component({
  selector: 'app-work-positions-for-edit',
  templateUrl: './work-positions-for-edit.html',
  styleUrl: './work-positions-for-edit.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class WorkPositionsForEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workPositionService = inject(WorkPositionService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly workPositionId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly selectedTab = signal<'workPosition' | 'schedule'>('workPosition');
  readonly schedule = signal<WorkPositionScheduleDto | null>(null);
  readonly scheduleLoaded = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly workPosition = toSignal(
    this.workPositionService.getById(this.workPositionId).pipe(catchError(() => of(null))),
    { initialValue: null },
  );

  readonly days = [
    { label: 'LUNES', dw: 1 },
    { label: 'MARTES', dw: 2 },
    { label: 'MIÉRCOLES', dw: 3 },
    { label: 'JUEVES', dw: 4 },
    { label: 'VIERNES', dw: 5 },
    { label: 'SÁBADO', dw: 6 },
    { label: 'DOMINGO', dw: 0 },
  ] as const;

  readonly tabOptions = [
    { id: 'workPosition' as const, label: 'Detalles del Puesto' },
    { id: 'schedule' as const, label: 'Horario de Trabajo' },
  ];

  readonly scheduleForm = this.fb.group({
    id: this.fb.control(''),
    name: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    isActive: this.fb.control(true),
    tipoJornada: this.fb.control(1, Validators.required),
    observaciones: this.fb.control('', Validators.maxLength(500)),
    diasDeTrabajo: this.fb.array<WorkDayGroup>(this.buildWorkDays()),
  }, { validators: scheduleValidator });

  readonly weeklyHours = computed(() => {
    const days = this.scheduleForm.controls.diasDeTrabajo.getRawValue();
    const result: Record<number, number> = {};
    for (const week of [1, 2, 3, 4]) {
      let minutes = 0;
      for (const day of days.filter((item) => item.numeroSemanaCiclo === week)) {
        if (day.esDescanso || !day.horaEntrada || !day.horaSalida) continue;
        const [entryHour, entryMinute] = day.horaEntrada.split(':').map(Number);
        const [exitHour, exitMinute] = day.horaSalida.split(':').map(Number);
        let difference = exitHour * 60 + exitMinute - (entryHour * 60 + entryMinute);
        if (difference < 0) difference += 24 * 60;
        minutes += difference;
      }
      result[week] = Number((minutes / 60).toFixed(2));
    }
    return result;
  });

  setTab(tab: 'workPosition' | 'schedule'): void {
    this.selectedTab.set(tab);
    if (tab === 'schedule' && !this.scheduleLoaded()) this.loadSchedule();
  }

  loadSchedule(): void {
    if (!this.workPositionId) return;
    this.workPositionService.getSchedule(this.workPositionId).subscribe({
      next: (response) => {
        this.schedule.set(response.data);
        this.scheduleLoaded.set(true);
        if (response.data) {
          this.scheduleForm.patchValue({
            id: response.data.id,
            name: response.data.name,
            isActive: response.data.isActive,
            tipoJornada: response.data.tipoJornada,
            observaciones: response.data.observaciones,
          });
          this.loadWorkDays(response.data.diasDeTrabajo ?? []);
        }
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el horario del puesto.');
        this.scheduleLoaded.set(true);
      },
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid || !this.workPositionId) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);
    const payload = this.scheduleForm.getRawValue() as WorkPositionScheduleForm;
    this.workPositionService.updateSchedule(this.workPositionId, payload).subscribe({
      next: (response) => {
        this.schedule.set(response.data);
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo actualizar el horario del puesto.');
        this.saving.set(false);
      },
    });
  }

  get workDays(): FormArray<WorkDayGroup> {
    return this.scheduleForm.controls.diasDeTrabajo;
  }

  findDay(week: number, dayOfWeek: number): WorkDayGroup | undefined {
    return this.workDays.controls.find((day) =>
      day.controls.numeroSemanaCiclo.value === week && day.controls.diaSemana.value === dayOfWeek);
  }

  onRestChange(day: WorkDayGroup, isRest: boolean): void {
    day.controls.esDescanso.setValue(isRest);
    if (isRest) {
      day.controls.horaEntrada.setValue(null);
      day.controls.horaSalida.setValue(null);
    }
    day.updateValueAndValidity();
    this.scheduleForm.updateValueAndValidity();
  }

  copyPreviousDay(week: number, currentDay: number): void {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const index = order.indexOf(currentDay);
    if (index <= 0) return;
    const source = this.findDay(week, order[index - 1]);
    const target = this.findDay(week, currentDay);
    if (source && target) target.patchValue(source.getRawValue());
  }

  copyPreviousWeek(week: number): void {
    if (week < 2 || week > 4) return;
    for (const day of this.days) {
      const source = this.findDay(week - 1, day.dw);
      const target = this.findDay(week, day.dw);
      if (source && target) target.patchValue(source.getRawValue());
    }
  }

  dayHasError(day: WorkDayGroup): boolean {
    return day.touched && (day.hasError('missingBothHours') || day.hasError('invalidTimeOrder'));
  }

  private buildWorkDays(): WorkDayGroup[] {
    const groups: WorkDayGroup[] = [];
    for (let week = 1; week <= 4; week++) {
      for (const day of this.days) {
        groups.push(this.createDayGroup(day.dw, week));
      }
    }
    return groups;
  }

  private createDayGroup(dayOfWeek: number, week: number, value?: WorkDayForm): WorkDayGroup {
    return this.fb.group<WorkDayControls>({
      id: this.fb.control(value?.id ?? ''),
      diaSemana: this.fb.control(value?.diaSemana ?? dayOfWeek),
      numeroSemanaCiclo: this.fb.control(value?.numeroSemanaCiclo ?? week),
      horaEntrada: this.fb.control(value?.horaEntrada ?? null),
      horaSalida: this.fb.control(value?.horaSalida ?? null),
      esDescanso: this.fb.control(value?.esDescanso ?? false),
    }, { validators: workDayValidator });
  }

  private loadWorkDays(days: WorkDayForm[]): void {
    const byKey = new Map(days.map((day) => [`${day.numeroSemanaCiclo}-${day.diaSemana}`, day]));
    this.workDays.clear();
    for (let week = 1; week <= 4; week++) {
      for (const day of this.days) {
        const value = byKey.get(`${week}-${day.dw}`);
        this.workDays.push(this.createDayGroup(day.dw, week, value));
      }
    }
    this.scheduleForm.updateValueAndValidity();
  }
}