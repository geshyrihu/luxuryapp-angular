import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CaratulaDTO } from "./interfaces/caratula.dto";
import { MiEdificioMobile } from "./mi-edificio-mobile";
@Component({
  selector: "app-mi-edificio",
  templateUrl: "./mi-edificio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, LxAvatar, MiEdificioMobile],
})
export class MiEdificio {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data = signal<CaratulaDTO | null>(null);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.MiEdificio.caratulaByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList<CaratulaDTO>(urlApi).then((result) => {
      this.data.set(result);
    });
  }
}
