import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-provider-use",
  templateUrl: "./provider-use.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class ProviderUse implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  providerId: string = "";

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData(this.providerId);
  }

  onLoadData(providerId: any) {
    const urlApi = `providers/coincidencias/${providerId}`;
    return this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}
