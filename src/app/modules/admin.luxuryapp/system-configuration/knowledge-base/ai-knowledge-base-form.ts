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
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputCheckSignal } from "@ui/inputs/web/lux-input-check-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/lux-input-textarea-signal";
import { AiKnowledgeBaseFormGroup } from "./interfaces/ai-knowledge-base-form.interface";

@Component({
  selector: "app-ai-knowledge-base-form",
  templateUrl: "./ai-knowledge-base-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LuxInputTextSignal,
    LuxInputTextAreaSignal,
    LuxInputCheckSignal,
    ButtonWeb,
    LuxInputSelectSignal, // Importado
  ],
})
export class AiKnowledgeBaseForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);
  modulesSignal = signal<any[]>([]); // Signal para opciones del select

  form: FormGroup<AiKnowledgeBaseFormGroup> = this.formB.group({
    id: new FormControl<string | null>(null),
    topic: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    keywords: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    instructions: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    route: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
    moduleAppId: new FormControl<string | null>(null), // Control para el módulo
  });

  ngOnInit(): void {
    this.onLoadModules(); // Cargar módulos al inicio

    // DynamicDialogConfig pasa 'id' en 'data' if editing
    if (this.config.data && this.config.data.id) {
      this.id = this.config.data.id;
      this.onLoadData();
    }
  }

  async onLoadModules() {
    const result = await this.apiResponseS.onGetList<any[]>(
      Endpoints.AiKnowledgeBase.modules,
    );
    if (result) {
      this.modulesSignal.set(result);
    }
  }

  async onLoadData() {
    const result = await this.apiResponseS.onGetItem(
      Endpoints.AiKnowledgeBase.getById(this.id),
    );
    if (result) {
      this.form.patchValue(result);
    }
  }

  async onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AiKnowledgeBase.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
