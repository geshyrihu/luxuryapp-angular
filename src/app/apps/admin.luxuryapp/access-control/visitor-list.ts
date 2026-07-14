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
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { VisitorDto } from "src/app/core/interfaces/visitor.dto";

interface IVisitorForm {
  fullName: FormControl<string>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  company: FormControl<string | null>;
  vehiclePlate: FormControl<string | null>;
  documentId: FormControl<string | null>;
  isBlacklisted: FormControl<boolean>;
  blacklistReason: FormControl<string | null>;
}

@Component({
  selector: "app-visitor-list",
  templateUrl: "./visitor-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    CustomInputSwitch,
    WebButtonLabel,
  ],
})
export class VisitorList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);

  dataSignal = signal<VisitorDto[]>([]);
  submitting = signal(false);
  editingId = signal<string | null>(null);

  form!: FormGroup<IVisitorForm>;

  ngOnInit(): void {
    this.onLoadData();
    this.form = this.formB.group<IVisitorForm>({
      fullName: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      company: new FormControl<string | null>(null),
      vehiclePlate: new FormControl<string | null>(null),
      documentId: new FormControl<string | null>(null),
      isBlacklisted: new FormControl(false, { nonNullable: true }),
      blacklistReason: new FormControl<string | null>(null),
    });
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList<VisitorDto[]>(Endpoints.AccessControlVisitors.getAll)
      .then((result) => this.dataSignal.set(result ?? []));
  }

  edit(visitor: VisitorDto): void {
    // Carga fresca desde el backend antes de editar
    this.apiResponseS
      .onGetItem<VisitorDto>(
        Endpoints.AccessControlVisitors.getById(visitor.id),
      )
      .then((fresh) => {
        const v = fresh ?? visitor;
        this.editingId.set(v.id);
        this.form.setValue({
          fullName: v.fullName,
          email: v.email,
          phone: v.phone,
          company: v.company,
          vehiclePlate: v.vehiclePlate,
          documentId: v.documentId,
          isBlacklisted: v.isBlacklisted,
          blacklistReason: v.blacklistReason,
        });
      });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({ isBlacklisted: false });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const id = this.editingId();
    const payload = this.form.getRawValue();
    const request = id
      ? this.apiResponseS.onPut<VisitorDto>(
          Endpoints.AccessControlVisitors.update(id),
          payload,
        )
      : this.apiResponseS.onPost<VisitorDto>(
          Endpoints.AccessControlVisitors.create,
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
