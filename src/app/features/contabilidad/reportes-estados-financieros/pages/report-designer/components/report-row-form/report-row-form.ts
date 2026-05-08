// import { CommonModule } from "@angular/common";
// import { Component, inject, OnInit, signal } from "@angular/core";
// import {
//   FormArray,
//   FormBuilder,
//   FormControl,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { MessageService } from "primeng/api";
// import { ButtonModule } from "primeng/button";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { InputTextModule } from "primeng/inputtext";
// import { TooltipModule } from "primeng/tooltip";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
// import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
// import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
// import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { AccountTreeSelector } from "../../../../components/account-tree-selector/account-tree-selector";
// import {
//   FinancialReportRow,
//   FinancialReportRowSource,
//   FinancialReportRowType,
//   FinancialReportSourceType,
// } from "../../../../models/financial-report.models";

// @Component({
//   selector: "app-report-row-form",

//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     ButtonModule,
//     InputTextModule,
//     TooltipModule,
//     CustomButton,
//     CustomButtonSave,
//     CustomButtonDelete,
//     CustomInputTextSignal,
//     CustomInputNumberSignal,
//     CustomInputSelectSignal,
//     CustomInputCheckSignal,
//     AccountTreeSelector,
//   ],
//   templateUrl: "./report-row-form.html",
//   providers: [MessageService],
// })
// export class ReportRowForm implements OnInit {
//   fb = inject(FormBuilder);
//   ref = inject(DynamicDialogRef);
//   config = inject(DynamicDialogConfig);
//   messageS = inject(MessageService);

//   // State
//   designContext = signal<{ customerId: string; year: number }>({
//     customerId: "",
//     year: new Date().getFullYear(),
//   });
//   showAccountSelector = signal<boolean>(false);
//   targetSourceIndex: number | null = null;
//   isEditMode = false;

//   // Form
//   form = this.fb.group({
//     id: [""],
//     name: ["", Validators.required],
//     order: [0],
//     rowType: [FinancialReportRowType.AccountGroup],
//     inverseSign: [false],
//     bold: [false],
//     formula: [""],
//     sources: this.fb.array([]),
//   });

//   // Options
//   rowTypesOptions = [
//     { label: "Cabecera", value: FinancialReportRowType.Header },
//     {
//       label: "Grupo de Cuentas",
//       value: FinancialReportRowType.AccountGroup,
//     },
//     { label: "Fórmula", value: FinancialReportRowType.Formula },
//     { label: "Total", value: FinancialReportRowType.Total },
//     {
//       label: "Espacio en Blanco",
//       value: FinancialReportRowType.Blank,
//     },
//   ];

//   sourceTypes = [
//     {
//       label: "Cuenta Mayor (102-000-000)",
//       value: FinancialReportSourceType.SpecificAccount,
//     },
//     {
//       label: "Rango (102... | 105...)",
//       value: FinancialReportSourceType.RangeAccount,
//     },
//     { label: "Empresa Total", value: FinancialReportSourceType.EmpresaTotal },
//     {
//       label: "Tipo de Cuenta (1 = Activo)",
//       value: FinancialReportSourceType.AccountType,
//     },
//     {
//       label: "Nivel de Cuenta (Todas nivel 2)",
//       value: FinancialReportSourceType.AccountLevel,
//     },
//     {
//       label: "Selector Dinómico (JSON/Nombre)",
//       value: FinancialReportSourceType.DynamicSelector,
//     },
//   ];

//   // Getters
//   get FinancialReportRowType() {
//     return FinancialReportRowType;
//   }
//   get sourceControls() {
//     return this.form.get("sources") as FormArray;
//   }

//   ngOnInit() {
//     if (this.config.data) {
//       const data = this.config.data;
//       // Configurar contexto si viene en la data
//       if (data.context) {
//         this.designContext.set(data.context);
//       }

//       // Cargar datos de la fila si es edición
//       if (data.row) {
//         this.isEditMode = true;
//         const row = data.row as FinancialReportRow;
//         this.form.patchValue({
//           id: row.id,
//           name: row.name,
//           order: row.order,
//           rowType: row.rowType as FinancialReportRowType,
//           inverseSign: row.inverseSign,
//           bold: row.bold,
//           formula: row.formula,
//         });
//         if (row.sources) {
//           row.sources.forEach((s) => this.addSource(s));
//         }
//       } else {
//         // Nuevo
//         this.isEditMode = false;
//         // Defaults
//         this.form.patchValue({
//           rowType: FinancialReportRowType.AccountGroup, // Use number directly
//           order: data.nextOrder || 0,
//         });
//       }
//     }
//   }

//   getControl(index: number, controlName: string): FormControl {
//     return this.sourceControls.at(index).get(controlName) as FormControl;
//   }

//   addSource(data?: FinancialReportRowSource) {
//     const g = this.fb.group({
//       sourceType: [
//         data?.sourceType ?? FinancialReportSourceType.SpecificAccount,
//       ],
//       value: [data?.value || ""],
//     });
//     this.sourceControls.push(g);
//   }

//   removeSource(index: number) {
//     this.sourceControls.removeAt(index);
//   }

//   // Selector Logic
//   openAccountSelector(index: number) {
//     this.targetSourceIndex = index;
//     this.showAccountSelector.set(true);
//   }

//   onAccountSelected(account: any) {
//     if (this.targetSourceIndex !== null) {
//       const control = this.getControl(this.targetSourceIndex, "value");
//       control.setValue(account.codigoCuenta);
//     }
//   }

//   // Actions
//   onSave() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     const val = this.form.value;
//     const result: FinancialReportRow = {
//       id: val.id || this.generateTempId(),
//       name: val.name!,
//       order: val.order || 0,
//       rowType: val.rowType!.toString(), // Convert number from Form to string for DTO
//       inverseSign: val.inverseSign || false,
//       bold: val.bold || false,
//       formula: val.formula || "",
//       sources: val.sources as FinancialReportRowSource[],
//     };
//     // Preservar parentId si vino en data original, pero eso lo maneja el padre al recibir el resultado

//     this.ref.close(result);
//   }

//   onCancel() {
//     this.ref.close(null);
//   }

//   private generateTempId(): string {
//     return (
//       "temp-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000)
//     );
//   }
// }
