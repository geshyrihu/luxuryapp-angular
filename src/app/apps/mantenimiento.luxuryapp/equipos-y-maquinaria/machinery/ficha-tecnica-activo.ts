import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FichaTecnicaActivoDto } from "src/app/core/interfaces/ficha-tecnica-activo.interface";
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
    const urlApi = Endpoints.RefactorMantenimiento.machineriesFichatecnicaById(this.id);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
