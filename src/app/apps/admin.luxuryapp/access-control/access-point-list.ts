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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AccessPointDto } from "src/app/core/interfaces/access-point.dto";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IAccessPointForm {
  name: FormControl<string>;
  accessPointType: FormControl<string>;
  location: FormControl<string | null>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-access-point-list",
  templateUrl: "./access-point-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabel,
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

  form!: FormGroup<IAccessPointForm>;

  ngOnInit(): void {
    this.onLoadData();
    this.form = this.formB.group<IAccessPointForm>({
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
