import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

@Component({
  selector: "app-ticket-legal-seguimiento",
  templateUrl: "./ticket-legal-seguimiento.html",
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class TicketLegalSeguimiento implements OnInit, OnDestroy {
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);

  submitting = signal(false);
  seguimientos = signal<any[]>([]);
  loading = signal(false);
  seguimientoLenght: Signal<number>;
  onCreateItem = false;

  // El dialogo pasa ticketId (id de la task migrada)
  private taskId: string = this.config.data.ticketId ?? this.config.data.id;
  id: string = "";

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    ticketMessageId: [this.taskId, Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
    description: [
      "",
      [Validators.required, Validators.maxLength(200), Validators.minLength(10)],
    ],
  });

  constructor() {
    const descriptionValue = toSignal(
      this.form.controls.description.valueChanges,
      { initialValue: "" },
    );

    this.seguimientoLenght = computed(
      () => 200 - (descriptionValue()?.length || 0),
    );

    effect(() => {
      const currentLength = descriptionValue()?.length || 0;
      if (currentLength > 200) {
        this.form.controls.description.setValue(
          descriptionValue()!.substring(0, 200),
          { emitEvent: false },
        );
      }
    });
  }

  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  onCargaListaseguimientos() {
    this.apiResponseS
      .onGetList(Endpoints.TaskFollowUps.listByTicketMessage(this.taskId))
      .then((result: any) => {
        this.seguimientos.set(result || []);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.TaskFollowUps.create,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: (raw) => {
        const { id, ...dto } = raw;
        return dto;
      },
    });

    if (result) {
      this.onCargaListaseguimientos();
      this.form.controls.description.setValue("");
      this.onCreateItem = true;
    }
  }

  ngOnDestroy(): void {
    if (this.onCreateItem) {
      this.ref.close(true);
    }
  }
}
