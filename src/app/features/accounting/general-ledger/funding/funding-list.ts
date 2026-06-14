import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { walletOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FaqsFondeo } from "src/app/features/accounting/fondeos-y-reporteo/funding/faqs-fondeo";
import { FundingForm } from "./funding-form";
@Component({
  selector: "app-funding-list",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./funding-list.html",
})
export class FundingList {
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  fechaInicio: Date | string | null = null;
  fechaFin: Date | string | null = null;

  loading = signal(true);
  dataSignal = signal<any[]>([]);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const current = this.dataSignal();
    return current.length > 0 ? globalFilterFields(current) : [];
  });

  constructor() {
    addIcons({ walletOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  isBuscarDisabled(): boolean {
    if (!this.fechaInicio || !this.fechaFin) return true;
    return new Date(this.fechaFin as any) < new Date(this.fechaInicio as any);
  }

  onLoadData(): void {
    const urlApi = `funding/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any): void {
    this.apiResponseS.onDelete(Endpoints.Funding.delete(id)).then(() => {
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  onDetails(id: string) {
    this.router.navigateByUrl(`/funding/details/${id}`);
  }

  onModalCreate(): void {
    this.dialogHandlerS
      .openDialog(FundingForm, {}, "Crear Fondeo", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(data: any): void {
    this.dialogHandlerS
      .openDialog(FundingForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onFaqsFondeo(): void {
    this.dialogHandlerS.openDialog(
      FaqsFondeo,
      {},
      "",
      this.dialogHandlerS.sizeLg,
    );
  }
}

