import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IFichaTecnicaActivo } from "src/app/core/interfaces/ficha-tecnica-activo.interface";
@Component({
  selector: "app-ficha-tecnica-activo",
  templateUrl: "./ficha-tecnica-activo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardModule],
})
export class FichaTecnicaActivo implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data: IFichaTecnicaActivo;
  id: string = "";

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Machineries/Fichatecnica/${this.id}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
