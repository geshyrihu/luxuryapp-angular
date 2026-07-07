import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { WorkContractDetailDTO } from "../models/work-contract.dto";

@Component({
  selector: "app-work-contract-detail",
  templateUrl: "./work-contract-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePipe, CurrencyPipe],
})
export class WorkContractDetailComponent implements OnInit {
  apiS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);

  item = signal<WorkContractDetailDTO | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.config.data?.id as string;
    this.apiS
      .onGetItem<WorkContractDetailDTO>(Endpoints.HR.WorkContract.getById(id))
      .then((resp) => {
        if (resp) this.item.set(resp);
        this.isLoading.set(false);
      });
  }
}
