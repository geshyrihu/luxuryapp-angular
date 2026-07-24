import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-mis-inspecciones-lista",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    MobileActionMenu,
    NgbTooltipModule,
    CommonModule,
    CustomInputDateSignal,
    DataViewMobile,
    MobileButtonLabelItem,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mis-inspecciones-lista.html",
})
export class MisInspeccionesLista {
  readonly ROUTES = ROUTES;
  private router = inject(Router);
  authService = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  dateSelectControl = new FormControl<Date | string>(new Date());

  navigateToResultado(id: string) {
    this.router.navigate(ROUTES.INSPECCIONES.RESULTADO(id));
  }

  navigateToMiInspeccion(id: string) {
    this.router.navigate(ROUTES.BITACORAS.MI_INSPECCION(id));
  }

  onLoadData() {
    const dateVal = this.dateSelectControl.value;
    if (dateVal instanceof Date) {
      const year = dateVal.getFullYear();
      const month = String(dateVal.getMonth() + 1).padStart(2, "0");
      const day = String(dateVal.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      this.apiResponseS
        .onGetList(
          Endpoints.InspectionResults.byUserCustomerAndDate(
            this.authService.applicationUserId,
            this.customerIdS.customerId(),
            formattedDate,
          ),
        )
        .then((result: any) => {
          this.dataSignal.set(result);
        });
    }
  }

  onDateChange(newDate: string): void {
    this.dateSelectControl.setValue(new Date(newDate), { emitEvent: false });
    this.onLoadData();
  }
}
