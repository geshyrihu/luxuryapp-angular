// import { Component, computed, effect, inject, signal } from "@angular/core";
// import { OrganizationChartModule } from "primeng/organizationchart";
// import { TableModule } from "primeng/table";
// import {
//   globalFilterFields,
//   rowsPerPageOptions,
//   tablePrimeNgRows,
// } from "src/app/core/helpers/table-primeng-option";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";
// @Component({
//   selector: "app-organigrama-interno",
//   templateUrl: "./organigrama-interno.html",
//   imports: [OrganizationChartModule, TableModule],
// })
// export class OrganigramaInterno {
//   apiResponseS = inject(ApiResponseService);
//   customerIdS = inject(CustomerIdService);
//   nameCustomer: string = "";
//   logoCustomer: string = "";
//   dataSignal = signal<any[]>([]);

//   globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
//   loading = signal(true);
//   tablePrimeNgRows: number = tablePrimeNgRows();
//   rowsPerPageOptions: number[] = rowsPerPageOptions();

//   constructor() {
//     effect(() => {
//       const customerId: string = this.customerIdS.customerId();
//       if (customerId) {
//         this.onLoadData();
//         this.OnLoadCustomer();
//       }
//     });
//   }

//   onLoadData() {
//     const urlApi = "OrganigramaInterno/" + this.customerIdS.customerId;
//     this.apiResponseS
//       .onGetList(urlApi)
//       .then((result: any) => this.dataSignal.set(result));
//   }
//   OnLoadCustomer() {
//     this.apiResponseS
//       .onGetItem(`Customers/${this.customerIdS.customerId()}`)
//       .then((result: any) => {
//         this.nameCustomer = result.nameCustomer;
//       });
//   }
// }
