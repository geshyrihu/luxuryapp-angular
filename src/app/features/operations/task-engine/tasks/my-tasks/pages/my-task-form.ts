import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { ImageAnalysisDialogComponent } from "src/app/shared/ui/image-analysis-dialog/image-analysis-dialog.component";
import { TaskGroupService } from "../../task.service";

@Component({
  selector: "app-my-task-form",
  templateUrl: "./my-task-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputImg,
    CustomInputTextAreaSignal,
    WebButtonLabel,
    WebButtonLabelSave,
    AvatarModule,
    ImageAnalysisDialogComponent,
  ],
})
export class MyTaskForm implements OnInit {
  visionDialog = viewChild.required(ImageAnalysisDialogComponent);

  private customerIdS = inject(CustomerIdService);
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private TaskGroupService = inject(TaskGroupService);
  // notificationPushService = inject(SignalRService);
  private enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);

  cb_priority = signal<ISelectItem[]>([]);
  cb_ticket_group = signal<ISelectItem[]>([]);

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    ticketGroupId: [this.config.data.ticketGroupId, Validators.required], // ticketGroupId
    title: ["", [Validators.required, Validators.maxLength(100)]], // Tútulo
    description: ["", [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authS.applicationUserId], // Id del creador
    customerId: [this.customerIdS.customerId()], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [""], // Vista previa de BeforeWork, string
    afterWorkPreview: [""], // Vista previa de AfterWork, string
    applicationUserId: [this.authS.applicationUserId],
    assignee: [""],
    assigneeId: [null],
    scheduledDate: [null],
    closedDate: [null],
  });

  async ngOnInit() {
    await this.onLoadSelectItems();
    this.id = this.config.data.id;
    this.form.controls.id.setValue(this.id);
    if (this.id !== "") this.onLoadData();
  }

  async onLoadSelectItems(): Promise<void> {
    const [priority, ticketGroups] = await Promise.all([
      firstValueFrom(this.enumSelectS.priorityLevel()),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.Tasks.groupListByCustomer(this.customerIdS.customerId()),
      ),
    ]);

    this.cb_priority.set(priority);
    this.cb_ticket_group.set(ticketGroups ?? []);
  }

  // Para manejar las imígenes 'BeforeWork' y 'AfterWork'
  onFileChange(event: any, fieldName: "beforeWork" | "afterWork") {
    const file = event.target.files[0];
    if (file) {
      this.form.controls[fieldName].setValue(file);

      // Crear una vista previa
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === "beforeWork")
          this.form.controls.beforeWorkPreview.setValue(
            reader.result as string,
          );
        if (fieldName === "afterWork")
          this.form.controls.afterWorkPreview.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
        // Si las imígenes existen, carga las vistas previas
        if (result.beforeWorkPreview) {
          this.form.controls.beforeWorkPreview.setValue(
            result.beforeWorkPreview,
          );
        }

        if (result.afterWorkPreview) {
          this.form.controls.afterWorkPreview.setValue(result.afterWorkPreview);
        }

        this.form.patchValue({
          applicationUserId: this.authS.applicationUserId,
        });
      });
  }

  openVision() {
    this.visionDialog().show();
  }

  onVisionResult(analysis: string) {
    const currentDesc = this.form.controls.description.value || "";
    const newDesc = currentDesc
      ? `${currentDesc}\n\n--- Análisis IA ---\n${analysis}`
      : `--- Análisis IA ---\n${analysis}`;

    this.form.controls.description.setValue(newDesc);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting.set(true);

      const formData = new FormData();

      const rawValues = this.form.getRawValue() as any;

      // Agrega todos los controles del formulario a FormData
      Object.keys(rawValues).forEach((key) => {
        const value = rawValues[key];

        if (key === "images") {
          // Should be FormArray check if used? Re-add if missing from logic but it wasn't in form definition before? Wait, line 140 checks key === "images" but it wasn't in form group. I will keep it logic wise if added dynamically or keep strict based on form.
          // Original form didn't have 'images' in group definition, so keys(controls) wouldn't iterate it unless added dynamically. Assuming static structure first.
        } else if (key === "beforeWork" || key === "afterWork") {
          // Manejar las imígenes de beforeWork y afterWork
          const file = value as File;
          if (file) {
            formData.append(key, file, file.name);
          }
        } else if (key === "scheduledDate" || key === "closedDate") {
          // Manejar la fecha programada (ScheduledDate) y la fecha de cierre (ClosedDate)
          if (value) {
            const formattedDate = new Date(value).toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
            formData.append(key, formattedDate);
          } else {
            formData.append(key, ""); // Si no hay valor, se envía como vacóo
          }
        } else {
          // Verifica si el valor es null antes de agregarlo a FormData
          const val = value === null ? "" : value;
          formData.append(key, val);
        }
      });

      // Verifica si es creación o actualización
      if (this.id === "") {
        this.apiResponseS
          .onPost(Endpoints.Tasks.create, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : this.submitting.set(false);
          });
      } else {
        this.apiResponseS
          .onPut(Endpoints.Tasks.update(this.id), formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : this.submitting.set(false);
          });
      }
    }
  }
}
