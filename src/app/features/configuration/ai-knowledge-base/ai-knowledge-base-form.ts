import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface IAiKnowledgeBaseForm {
  id: FormControl<string | null>;
  topic: FormControl<string>;
  instructions: FormControl<string>;
  keywords: FormControl<string>;
  route: FormControl<string>;
  isActive: FormControl<boolean>;
  moduleAppId: FormControl<string | null>;
}

@Component({
  selector: "app-ai-knowledge-base-form",
  templateUrl: "./ai-knowledge-base-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputCheckSignal,
    CustomButtonSave,
    CustomInputSelectSignal, // Importado
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

  form: FormGroup<IAiKnowledgeBaseForm> = this.formB.group({
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
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    let result: boolean;

    if (!this.id) {
      result = await this.apiResponseS.onPost(
        Endpoints.AiKnowledgeBase.base,
        this.form.value,
      );
    } else {
      result = await this.apiResponseS.onPut(
        Endpoints.AiKnowledgeBase.base,
        this.form.value,
      );
    }

    if (result) {
      this.ref.close(true);
    } else {
      this.submitting.set(false);
    }
  }
}
