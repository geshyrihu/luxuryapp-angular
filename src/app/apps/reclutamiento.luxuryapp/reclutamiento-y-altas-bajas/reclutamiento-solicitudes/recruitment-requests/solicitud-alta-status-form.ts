import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IRequestEmployeeRegisterBasicInfo } from "./dtos/request-employee-register-basic-info.dto";
import { IRequestEmployeeRegisterUpdateStatus } from "./dtos/request-employee-register-update-status.dto";
@Component({
  selector: "app-solicitud-alta-status-form",
  templateUrl: "./solicitud-alta-status-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class SolicitudAltaStatusForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);

  statusOptions = signal<SelectItemDto[]>([]);

  form = this.formBuilder.nonNullable.group({
    id: [""],
    folio: [{ value: "", disabled: true }],
    employeeName: [{ value: "", disabled: true }],
    status: [null as number | null, Validators.required],
    confirmationFinish: [false],
  });

  async ngOnInit() {
    this.id = this.config.data.id;
    this.form.patchValue({ employeeName: this.config.data.employeeName });
    this.statusOptions.set(await firstValueFrom(this.enumSelectS.status()));

    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<IRequestEmployeeRegisterBasicInfo>(
        EndpointsReclutamiento.RequestEmployeeRegister.getBasicInfo(this.id),
      )
      .then((result) => {
        // Exclude folio from direct patch because types differ (number vs string)
        const { folio, ...rest } = result;
        this.form.patchValue(rest as any);
        this.form.patchValue({
          folio: `ALT${folio.toString().padStart(5, "0")}`,
        });
      });
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formData = this.form.getRawValue();

    const dto: IRequestEmployeeRegisterUpdateStatus = {
      status: formData.status!,
      confirmationFinish: formData.confirmationFinish,
    };

    this.apiResponseS
      .onPut(
        EndpointsReclutamiento.RequestEmployeeRegister.updateStatus(this.id),
        dto,
      )
      .then((result) => {
        this.ref.close(true);
      })
      .finally(() => this.submitting.set(false));
  }
}
