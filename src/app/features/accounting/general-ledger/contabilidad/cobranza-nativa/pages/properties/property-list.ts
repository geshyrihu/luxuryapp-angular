// import { DecimalPipe } from "@angular/common";
// import { Component, effect, inject, signal } from "@angular/core";
// import { IonItem, IonLabel } from "@ionic/angular/standalone";
// import { TableModule } from "primeng/table";
// import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
// import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
// import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
// import {
//   rowsPerPageOptions,
//   tablePrimeNgRows,
// } from "src/app/core/helpers/table-primeng-option";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";
// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

// export interface PropertyResponseDTO {
//   id: string;
//   fullName: string;
//   accountNumber: string;
//   department: string;
//   tower: string;
//   floor: string;
//   unitNumber: string;
//   areaM2: number | null;
//   indivisoPercentage: number | null;
//   parkingSlots: number | null;
//   storageUnit: string;
//   customerId: string;
//   isDelinquent: boolean;
// }

// @Component({
//   selector: "app-property-list",
//   imports: [
//     TableModule,
//     PrimeNgCustomCaption,
//     CustomButtonEdit,
//     CustomButtonDelete,
//     DataViewMobile,
//     ActionMenu,
//     CustomButtonEdit,
//     CustomButtonDelete,
//     IonItem,
//     IonLabel,
//     DecimalPipe,
//   ],
//   templateUrl: "./property-list.html",
// })
// export default class PropertyList {
//   private apiResponseS = inject(ApiResponseService);
//   private customerIdS = inject(CustomerIdService);
//   private dialogHandlerS = inject(DialogHandlerService);

//   tablePrimeNgRows = tablePrimeNgRows();
//   rowsPerPageOptions = rowsPerPageOptions();
//   scrollHeight = inject(TableScrollHeightService).scrollHeight;

//   dataSignal = signal<PropertyResponseDTO[]>([]);

//   constructor() {
//     effect(() => {
//       const customerId = this.customerIdS.customerId();
//       if (customerId) this.onLoadData();
//     });
//   }

//   onLoadData() {
//     const customerId = this.customerIdS.customerId();
//     if (!customerId) return;
//     this.apiResponseS
//       .onGetItem<PropertyResponseDTO[]>(`Property/list/${customerId}`)
//       .then((res) => this.dataSignal.set(res ?? []));
//   }

//   onModalForm(id = "") {
//     const customerId = this.customerIdS.customerId();
//     const data = {
//       id,
//       customerId,
//       title: id ? "Editar Propiedad" : "Nueva Propiedad",
//     };
//     import("./property-form").then((m) => {
//       this.dialogHandlerS
//         .openDialog(m.default, data, data.title, this.dialogHandlerS.sizeLg)
//         .then((res: boolean) => {
//           if (res) this.onLoadData();
//         });
//     });
//   }

//   async onDelete(item: PropertyResponseDTO) {
//     const ok = await this.apiResponseS.onDelete(`Property/${item.id}`);
//     if (ok) this.dataSignal.update((d) => d.filter((p) => p.id !== item.id));
//   }
// }
