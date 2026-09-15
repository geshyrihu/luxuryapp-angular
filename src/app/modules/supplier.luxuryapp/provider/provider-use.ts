import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
@Component({
  selector: "app-provider-use",
  templateUrl: "./provider-use.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ProviderUse implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data = signal<any[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  providerId: string = "";

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData(this.providerId);
  }

  onLoadData(providerId: string) {
    const urlApi = Endpoints.Providers.coincidences(providerId);
    return this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data.set(result);

      this.globalFilterFields = globalFilterFields(this.data());
    });
  }
}

