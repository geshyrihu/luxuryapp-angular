import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { WorkContractDetailDTO } from "./interfaces/work-contract.dto";

@Component({
  selector: "app-work-contract-detail",
  templateUrl: "./work-contract-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, DatePipe, CurrencyPipe],
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
