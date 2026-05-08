// import { CommonModule, UpperCasePipe } from "@angular/common";
// import {
//   Component,
//   computed,
//   effect,
//   inject,
//   OnInit,
//   signal,
// } from "@angular/core";
// import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
// import { addIcons } from "ionicons";
// import { documentTextOutline } from "ionicons/icons";
// import {
//   NgbDropdownModule,
//   NgbTooltipModule,
// } from "@ng-bootstrap/ng-bootstrap";
// import { DynamicDialogRef } from "primeng/dynamicdialog";
// import { InputTextModule } from "primeng/inputtext";
// import { TableModule } from "primeng/table";
// import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
// import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
// import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
// import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
// import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
// import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
// import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
// import {
//   globalFilterFields,
//   rowsPerPageOptions,
//   tablePrimeNgRows,
// } from "src/app/core/helpers/table-primeng-option";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { AspRoleService } from "src/app/core/services/asp-role.service";
// import { AuthService } from "src/app/core/services/auth.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";
// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
// import { EDocumentType } from "src/app/features/legal/models/document-type.enum";
// import { ManualsAndProcessesForm } from "./manuals-and-processes-form";
// @Component({
//   selector: "app-manuals-and-processes-list",
//   templateUrl: "./manuals-and-processes-list.html",
//   imports: [
//     CommonModule,
//     TableModule,
//     InputTextModule,
//     NgbTooltipModule,
//     NgbDropdownModule,
//     UpperCasePipe,
//     CustomButtonEdit,
//     CustomButtonDelete,
//     CustomButtonViewPdf,
//     CustomButtonViewPdf,
//     PrimeNgCustomCaption,
//     PrimeNgCustomTableFooter,
//     DataViewMobile,
//     ActionMenu,
//     IonButtonEdit,
//     IonButtonDelete,
//     IonItem,
//     IonLabel,
//     IonIcon,
//   ],
// })
// export class ManualsAndProcessesList implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   dialogHandlerS = inject(DialogHandlerService);
//   authS = inject(AuthService);
//   customerIdS = inject(CustomerIdService);
//   public aspRoleS = inject(AspRoleService);
//   public AspRole = EApplicationRole;
//   tableScrollHeightS = inject(TableScrollHeightService);
//   dataSignal = signal<any[]>([]);

//   globalFilterFields = computed(() => {
//     const data = this.dataSignal();
//     if (!data || data.length === 0) return [];
//     return globalFilterFields(data);
//   });
//   loading = signal(true);
//   tablePrimeNgRows: number = tablePrimeNgRows();
//   rowsPerPageOptions: number[] = rowsPerPageOptions();
//   ref: DynamicDialogRef;
//   scrollHeight = this.tableScrollHeightS.scrollHeight;

//   constructor() {
//     addIcons({ documentTextOutline });
//     effect(() => {
//       const customerId: string = this.customerIdS.customerId();
//       if (customerId) this.onLoadData();
//     });
//   }

//   ngOnInit(): void {
//     this.onLoadData();
//   }

//   onLoadData() {
//     const customerId: string = this.customerIdS.customerId();
//     const urlApi = `customdocument/list/${customerId}/${EDocumentType.ManualsAndProcesses}`;
//     this.apiResponseS
//       .onGetList(urlApi)
//       .then((result: any) => this.dataSignal.set(result));
//   }
//   onDelete(id: any) {
//     this.apiResponseS
//       .onDelete(`customdocument/${id}`)
//       .then((result: boolean) => {
//         if (result) {
//           this.dataSignal.update((currentData) =>
//             currentData.filter((item) => item.id !== id),
//           );
//         }
//       });
//   }

//   onModalForm(data: any) {
//     this.dialogHandlerS
//       .openDialog(
//         ManualsAndProcessesForm,
//         data,
//         data.title,
//         this.dialogHandlerS.sizeLg,
//       )
//       .then((result: boolean) => {
//         if (result) this.onLoadData();
//       });
//   }
// }
