import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LxCard } from "@ui/adaptive/card/card";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Touchspin } from "@ui/web/touchspin/touchspin";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DateService } from "src/app/core/services/date.service";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-realizar-evaluacion",

  templateUrl: "./realizar-evaluacion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LxCard,
    LxMessage,
    CustomInputSelectSignal,
    LxDivider,
    CustomInputTextAreaSignal,
    Touchspin,
    WebButtonLabelSave,
  ],
})
export class RealizarEvaluacion implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  route = inject(Router); // Inyecta ActivatedRoute

  // --- Listas para los Dropdowns ---
  employees: any[] = [];
  templates: any[] = [];
  // Nueva propiedad para guardar el ID de la evaluación una vez creada
  currentPerformanceEvaluationId: string | null = null;
  submitting = signal(false);
  isEditMode = false;
  evaluationId: string | null = null;

  userIdLogged: string = this.authS.applicationUserId;
  // --- Formulario Principal ---
  form!: FormGroup;
  selectedTemplate: any = null;

  get evaluatedEmployeeName(): string {
    const evaluatedId = this.form.get("evaluatedId")?.value;
    const employee = this.employees.find((emp) => emp.value === evaluatedId);
    return employee ? employee.label : "Empleado Desconocido";
  }

  paramsSignal = toSignal(this.activatedRoute.paramMap);

  constructor() {
    effect(() => {
      if (this.paramsSignal()) {
        const params = this.paramsSignal()!;
        const id = params.get("id");
        if (id) {
          this.isEditMode = true;
          this.loadEvaluationData(id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.initForm();
    // Subscription moved to effect
  }

  // Reemplaza el método loadEvaluationData completo con este:
  async loadEvaluationData(id: string): Promise<void> {
    try {
      // 1. Obtener los datos de la evaluación y ESPERAR la respuesta
      const data: any = await this.apiResponseS.onGetItem(
        Endpoints.PerformanceEvaluations.result(id),
      );
      this.evaluationId = data.id;

      // 2. Rellenar los campos principales del formulario
      this.form.patchValue({
        evaluatorId: data.evaluatorId,
        evaluatedId: data.employeeId, // Usamos el ID numírico del empleado
        evaluationTemplateId: data.evaluationTemplateId,
        evaluationDate: data.evaluationDate,
      });

      // 3. Cargar la plantilla y ESPERAR a que el FormArray de respuestas se construya
      await this.onTemplateSelect(data.evaluationTemplateId);

      // 4. Ahora que el FormArray esté listo, rellenar las respuestas
      const answersArray = this.form.get("answers") as FormArray;
      const allAnswers: any[] =
        data.categories?.flatMap((cat: any) => cat.answers || []) || [];

      allAnswers.forEach((answer: any, index: number) => {
        if (answersArray.at(index)) {
          answersArray.at(index).patchValue({
            score: answer.score,
            comments: answer.comments,
          });
        }
      });

      // 5. Deshabilitar los campos al final de todo el proceso
      // this.form.get("evaluatedId")?.disable();
      // this.form.get("evaluationTemplateId")?.disable();

      // 6. Verificar el estado final del formulario (usa getRawValue para ver los deshabilitados)
    } catch (error) {
      console.error("Fallé la carga de la evaluación:", error);
      // Aqué podrías mostrar una notificación al usuario
    }
  }

  initForm(): void {
    this.form = this.fb.nonNullable.group({
      evaluatorId: [
        { value: this.userIdLogged, disabled: this.isEditMode },
        Validators.required,
      ],
      evaluatedId: [
        { value: null as string | null, disabled: this.isEditMode },
        Validators.required,
      ],
      evaluationTemplateId: [
        { value: null as string | null, disabled: this.isEditMode },
        Validators.required,
      ],
      evaluationDate: [this.dateS.getDateNow(), Validators.required],
      answers: this.fb.array([]),
    });
  }

  loadInitialData(): void {
    const customerId: string = this.customerIdS.customerId();
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(`employee/${customerId}`)
      .then((response: any) => (this.employees = response));

    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(`EvaluationTemplates/${customerId}`)
      .then((response: any) => (this.templates = response));
  }

  // Reemplaza el método onTemplateSelect completo con este:
  onTemplateSelect(templateId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!templateId) {
        this.selectedTemplate = null;
        this.answers.clear();
        return resolve(); // Resuelve si no hay templateId
      }

      this.apiResponseS
        .onGetItem(`TemplateEvaluation/${templateId}`)
        .then((response: any) => {
          this.selectedTemplate = response;
          this.buildAnswersFormArray(); // Construye el FormArray
          resolve(); // Avisa que ya terminé
        })
        .catch((error) => {
          console.error("Error loading template:", error);
          reject(error); // Avisa si hubo un error
        });
    });
  }

  get answers(): FormArray {
    return this.form.get("answers") as FormArray;
  }

  buildAnswersFormArray(): void {
    this.answers.clear();
    if (!this.selectedTemplate) return;

    this.selectedTemplate.categories.forEach((category: any) => {
      category.questions.forEach((question: any) => {
        this.answers.push(
          this.fb.nonNullable.group({
            templateQuestionId: [
              { value: question.id, disabled: this.isEditMode },
            ],
            score: [
              { value: 1, disabled: this.isEditMode },
              [Validators.required, Validators.min(0), Validators.max(5)],
            ],
            comments: [{ value: "", disabled: this.isEditMode }],
          }),
        );
      });
    });
  }

  onScoreChange(
    newValue: number,
    categoryIndex: number,
    questionIndex: number,
  ): void {
    const index = this.getQuestionControlIndex(categoryIndex, questionIndex);
    const control = this.answers.at(index).get("score");
    if (control) {
      control.setValue(newValue);
    }
  }

  getScoreControl(categoryIndex: number, questionIndex: number): FormControl {
    const index = this.getQuestionControlIndex(categoryIndex, questionIndex);
    return this.answers.at(index).get("score") as FormControl;
  }
  getCommentControl(categoryIndex: number, questionIndex: number): FormControl {
    const index = this.getQuestionControlIndex(categoryIndex, questionIndex);
    return this.answers.at(index).get("comments") as FormControl;
  }
  getQuestionControlIndex(
    categoryIndex: number,
    questionIndex: number,
  ): number {
    let currentIndex = 0;
    for (let i = 0; i < categoryIndex; i++) {
      currentIndex += this.selectedTemplate.categories[i].questions.length;
    }
    return currentIndex + questionIndex;
  }

  // Método para manejar cambios directos en el input
  onInputChange(categoryIndex: number, questionIndex: number, event: any) {
    const index = this.getQuestionControlIndex(categoryIndex, questionIndex);

    if (index >= 0 && index < this.answers.length) {
      const answerGroup = this.answers.at(index);
      let value = parseInt(event.target.value) || 1;

      // Validar lómites (min: 1, max: 5)
      if (value < 1) value = 1; // Cambiado de 0 a 1
      if (value > 5) value = 5;

      answerGroup.get("score")?.setValue(value);
    } else {
      console.error("óndice invólido:", index);
    }
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const DTO: any = this.form.getRawValue(); // Usar getRawValue para incluir valores deshabilitados

    if (this.isEditMode && this.evaluationId) {
      this.apiResponseS
        .onPut(`PerformanceEvaluations/Update/${this.evaluationId}`, DTO)
        .then((result: any) => {
          if (result) {
            this.submitting.set(false);
          }
        });
    } else {
      this.apiResponseS
        .onPost("PerformanceEvaluations/Create", DTO)
        .then((result: any) => {
          if (result) {
            this.route.navigate(
              ROUTES.EVALUACION_EMPLEADOS.CONDUCTA_EDITAR(result.id),
            );
            this.submitting.set(false);
          }
        });
    }
  }
}
