import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FieldsetModule } from "primeng/fieldset";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TooltipModule } from "primeng/tooltip";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IQuestionForm {
  id: FormControl<string | null>;
  questionText: FormControl<string>;
  order: FormControl<number>;
}

interface ICategoryForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  order: FormControl<number>;
  questions: FormArray<FormGroup<IQuestionForm>>;
}

@Component({
  selector: "app-formulario-plantilla-evaluacion",
  templateUrl: "./formulario-plantilla-evaluacion.html",
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    MessageModule,
    TooltipModule,
    FieldsetModule,
    CustomButton,
    CustomButtonDelete,
    CustomButtonSave,
    CustomInputCheckSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AppIcon,
  ],
})
export class FormularioPlantillaEvaluacion implements OnInit {
  // Inyección de dependencias
  apiResponseS = inject(ApiResponseService);
  customerSelectS = inject(CustomerIdService);
  activatedRoute = inject(ActivatedRoute);
  route = inject(Router);

  id: string | null = null;
  customerId: string = this.customerSelectS.customerId();
  submitting = signal(false);
  isEditMode = false;

  // Definición estricta del formulario
  form = new FormGroup({
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    description: new FormControl<string>(""),
    isActive: new FormControl<boolean>(true, { nonNullable: true }),
    customerId: new FormControl<string>(this.customerSelectS.customerId(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categories: new FormArray<FormGroup<ICategoryForm>>([]),
  });

  paramsSignal = toSignal(this.activatedRoute.paramMap);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        this.id = params.get("id");
        this.isEditMode = !!this.id;
        if (this.id) {
          this.onLoadData();
        }
      }
    });
  }

  ngOnInit(): void {
    // Logic moved to effect
  }

  private onLoadData(): void {
    const urlApi = `TemplateEvaluation/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        name: result.name,
        description: result.description,
        isActive: result.isActive,
        customerId: result.customerId,
      });

      this.categories.clear();

      if (result.categories && result.categories.length > 0) {
        result.categories.forEach((category: any) => {
          this.addCategory(category);
        });
      }
    });
  }

  // --- Mótodos para manejar el FormArray de Categorías ---
  get categories(): FormArray<FormGroup<ICategoryForm>> {
    return this.form.controls.categories;
  }

  addCategory(category?: any): void {
    const questionsArray = new FormArray<FormGroup<IQuestionForm>>([]);

    if (category?.questions) {
      category.questions.forEach((question: any) => {
        questionsArray.push(this.createQuestionGroup(question));
      });
    }

    const categoryGroup = new FormGroup<ICategoryForm>({
      id: new FormControl(category?.id ?? null),
      name: new FormControl(category?.name ?? "", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      order: new FormControl(category?.order ?? this.categories.length + 1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      questions: questionsArray,
    });

    this.categories.push(categoryGroup);
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  // --- Mótodos para manejar el FormArray anidado de Preguntas ---
  questions(categoryIndex: number): FormArray<FormGroup<IQuestionForm>> {
    return this.categories.at(categoryIndex).controls.questions;
  }

  createQuestionGroup(question?: any): FormGroup<IQuestionForm> {
    return new FormGroup<IQuestionForm>({
      id: new FormControl(question?.id ?? null),
      questionText: new FormControl(question?.questionText ?? "", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      order: new FormControl(question?.order ?? 1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  addQuestion(categoryIndex: number): void {
    const questionsArray = this.questions(categoryIndex);
    const newOrder = questionsArray.length + 1;
    const questionGroup = this.createQuestionGroup();
    questionGroup.controls.order.setValue(newOrder);
    questionsArray.push(questionGroup);
  }

  removeQuestion(categoryIndex: number, questionIndex: number): void {
    this.questions(categoryIndex).removeAt(questionIndex);
  }

  // --- Acciones del Formulario ---
  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const formValue = this.form.getRawValue(); // Usa getRawValue para incluir controles deshabilitados si los hubiera

    if (!this.id) {
      // Crear nuevo
      this.apiResponseS
        .onPost(`TemplateEvaluation`, formValue)
        .then((result: any) => {
          if (result) {
            console.log("Template creado exitosamente");
            this.submitting.set(false);
            this.route.navigate([
              "/employee-evaluation/templates/edit",
              result.id,
            ]);
          } else {
            this.submitting.set(false);
          }
        });
    } else {
      // Editar existente
      this.apiResponseS
        .onPut(`TemplateEvaluation/${this.id}`, formValue)
        .then(() => {
          this.submitting.set(false);
        });
    }
  }

  onOrderChange(newValue: number, categoryIndex: number): void {
    const control = this.categories.at(categoryIndex).controls.order;
    if (control) {
      control.setValue(newValue);
    }
  }

  onQuestionOrderChange(
    newValue: number,
    categoryIndex: number,
    questionIndex: number,
  ): void {
    const control =
      this.questions(categoryIndex).at(questionIndex).controls.order;
    if (control) {
      control.setValue(newValue);
    }
  }

  onDropQuestion(
    event: CdkDragDrop<AbstractControl[]>,
    categoryIndex: number,
  ): void {
    const questionArray = this.questions(categoryIndex);
    moveItemInArray(
      questionArray.controls,
      event.previousIndex,
      event.currentIndex,
    );

    // Reordenar valores de 'order'
    questionArray.controls.forEach((group, idx) => {
      const control = group.controls.order;
      if (control) {
        control.setValue(idx + 1);
      }
    });
  }

  validateOrders(categoryIndex: number): void {
    const orders = this.questions(categoryIndex).controls.map(
      (ctrl) => ctrl.controls.order.value,
    );
    const hasDuplicates = new Set(orders).size !== orders.length;
    const hasOutOfRange = orders.some((o) => o < 1 || o > 100);

    if (hasDuplicates || hasOutOfRange) {
      console.warn(
        `?? Problemas con los órdenes en categoría ${categoryIndex + 1}`,
      );
    }
  }

  onDropCategory(event: CdkDragDrop<AbstractControl[]>): void {
    moveItemInArray(
      this.categories.controls,
      event.previousIndex,
      event.currentIndex,
    );

    // Reordenar valores de 'order'
    this.categories.controls.forEach((group, idx) => {
      const control = group.controls.order;
      if (control) {
        control.setValue(idx + 1);
      }
    });
  }
}
