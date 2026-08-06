import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { lastValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";

@Component({
  selector: "app-candidate-process-hiring-modal",
  standalone: true,
  templateUrl: "./candidate-process-hiring-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
})
export class CandidateProcessHiringModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  submitting = signal(false);
  id: string = this.config.data.id;
  toStage: CandidateApplicationStage = this.config.data.toStage;
  cb_contracts = signal<SelectItemDto[]>([]);

  form: FormGroup = new FormGroup({
    executionDate: new FormControl<string | null>(null, Validators.required),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    boss: new FormControl<string | null>(null),
    customerAddress: new FormControl<string | null>(null),
    additionalInformation: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.cb_contracts.set(await lastValueFrom(this.enumSelectS.typeContractRegister()));
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const payload = {
      executionDate: this.toDateOnly(this.form.controls["executionDate"].value),
      typeContractRegister: this.form.controls["typeContractRegister"].value,
      boss: this.form.controls["boss"].value ?? "",
      customerAddress: this.form.controls["customerAddress"].value ?? "",
      additionalInformation:
        this.form.controls["additionalInformation"].value ?? "",
    };

    this.submitting.set(true);
    this.apiResponseS
      .onPost<boolean>(
        EndpointsReclutamiento.CandidateApplications.processHiring(this.id),
        payload,
      )
      .then((result: boolean | false) => {
        if (result) this.ref.close(true);
        else this.submitting.set(false);
      });
  }

  private toDateOnly(value: string | null): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
