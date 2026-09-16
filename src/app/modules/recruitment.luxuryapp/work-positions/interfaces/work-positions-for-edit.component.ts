import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { WorkPositionService } from './work-position.service';
import {
  WorkDayForm,
  WorkPositionScheduleForm,
} from '../models/work-position-schedule-form.model';
import { WorkPositionScheduleDto } from '../models/work-position-schedule-dto.model';

type WorkDayControls = {
  id: ReturnType<NonNullableFormBuilder['control']>;
  diaSemana: ReturnType<NonNullableFormBuilder['control']>;
  numeroSemanaCiclo: ReturnType<NonNullableFormBuilder['control']>;
  horaEntrada: ReturnType<NonNullableFormBuilder['control']>;
  horaSalida: ReturnType<NonNullableFormBuilder['control']>;
  esDescanso: ReturnType<NonNullableFormBuilder['control']>;
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

  readonly scheduleForm = this.fb.group({
    id: this.fb.control(''),
    name: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    isActive: this.fb.control(true),
    tipoJornada: this.fb.control(1, Validators.required),
    observaciones: this.fb.control(''),
    diasDeTrabajo: this.fb.array<FormGroup<WorkDayControls>>([]),
  });

  readonly tabOptions = [
    { id: 'workPosition' as const, label: 'Detalles del Puesto' },
    { id: 'schedule' as const, label: 'Horario de Trabajo' },
  ];

  setTab(tab: 'workPosition' | 'schedule'): void {
    this.selectedTab.set(tab);
    if (tab === 'schedule' && !this.scheduleLoaded()) {
      this.loadSchedule();
    }
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
          this.replaceWorkDays(response.data.diasDeTrabajo);
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
    const payload: WorkPositionScheduleForm = this.scheduleForm.getRawValue();

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

  get workDays() {
    return this.scheduleForm.controls.diasDeTrabajo;
  }

  private replaceWorkDays(days: WorkDayForm[]): void {
    this.workDays.clear();
    for (const day of days) {
      this.workDays.push(
        this.fb.group<WorkDayControls>({
          id: this.fb.control(day.id ?? ''),
          diaSemana: this.fb.control(day.diaSemana),
          numeroSemanaCiclo: this.fb.control(day.numeroSemanaCiclo),
          horaEntrada: this.fb.control(day.horaEntrada),
          horaSalida: this.fb.control(day.horaSalida),
          esDescanso: this.fb.control(day.esDescanso),
        }),
      );
    }
  }
}
