import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { EmployeeWorkContractDetailDTO } from "./interfaces/work-contract.dto";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";

@Component({
  selector: "app-work-contract-detail",
  templateUrl: "./work-contract-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, ApiDatePipe, CurrencyPipe, WebButtonIconViewPdf],
})
export class WorkContractDetailComponent implements OnInit {
  apiS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);

  item = signal<EmployeeWorkContractDetailDTO | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.config.data?.id as string;
    this.apiS
      .onGetItem<EmployeeWorkContractDetailDTO>(
        Endpoints.HR.EmployeeWorkContract.getById(id),
      )
      .then((resp) => {
        if (resp) this.item.set(resp);
        this.isLoading.set(false);
      });
  }
}

