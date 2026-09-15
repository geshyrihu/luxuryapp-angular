import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FichaTecnicaActivoDto } from "@core/interfaces/ficha-tecnica-activo.interface";
@Component({
  selector: "app-ficha-tecnica-activo",
  templateUrl: "./ficha-tecnica-activo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class FichaTecnicaActivo implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data: FichaTecnicaActivoDto;
  id: string = "";

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.Machineries.technicalSheet(this.id);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}

