import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccessPointDto } from "@core/interfaces/access-point.dto";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ButtonWeb } from "@ui/buttons/web";

import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputSwitch } from "@ui/inputs/web/lux-input-switch-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { AccessPointFormGroup } from "./interfaces/access-point-form.interface";

@Component({
  selector: "app-access-point-list",
  templateUrl: "./access-point-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ReactiveFormsModule,
    AppTable,
    LuxInputTextSignal,
    LuxInputSelectSignal,
    LuxInputSwitch,
  ],
})
export class AccessPointList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);

  dataSignal = signal<AccessPointDto[]>([]);
  submitting = signal(false);
  editingId = signal<string | null>(null);

  types: SelectItemDto[] = [
    { value: "Pedestrian", label: "Peatonal" },
    { value: "Vehicle", label: "Vehicular" },
    { value: "Service", label: "Servicio" },
    { value: "Emergency", label: "Emergencia" },
  ];

  form!: FormGroup<AccessPointFormGroup>;

  ngOnInit(): void {
    this.onLoadData();
    this.form = this.formB.group<AccessPointFormGroup>({
      name: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      accessPointType: new FormControl("Pedestrian", { nonNullable: true }),
      location: new FormControl<string | null>(null),
      isActive: new FormControl(true, { nonNullable: true }),
    });
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList<AccessPointDto[]>(Endpoints.AccessControlAccessPoints.getAll)
      .then((result) => this.dataSignal.set(result ?? []));
  }

  edit(ap: AccessPointDto): void {
    this.editingId.set(ap.id);
    this.form.setValue({
      name: ap.name,
      accessPointType: ap.accessPointType,
      location: ap.location,
      isActive: ap.isActive,
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({ accessPointType: "Pedestrian", isActive: true });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const id = this.editingId();
    const payload = this.form.getRawValue();
    const request = id
      ? this.apiResponseS.onPut<AccessPointDto>(
          Endpoints.AccessControlAccessPoints.update(id),
          payload,
        )
      : this.apiResponseS.onPost<AccessPointDto>(
          Endpoints.AccessControlAccessPoints.create,
          payload,
        );

    request.then((result) => {
      this.submitting.set(false);
      if (result) {
        this.resetForm();
        this.onLoadData();
      }
    });
  }
}
