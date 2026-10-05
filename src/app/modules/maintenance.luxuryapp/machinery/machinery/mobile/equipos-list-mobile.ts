import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { CurrencyMexicoPipe } from "@shared/pipes/currencyMexico.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-equipos-list-mobile",
  templateUrl: "./equipos-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIcon, WebButtonLabel, DataViewMobile, SanitizeHtmlPipe, CurrencyMexicoPipe],
})
export class EquiposListMobile {
  data = input.required<any[]>();
  loading = input<boolean>(false);
  title = input<string>("");
  globalFilterFields = input<string[]>([]);
  categories = input<any[]>([]);
  showContents = input<boolean>(false);
  canManage = input<boolean>(false);

  add = output<any>();
  downloadPdf = output<void>();
  downloadQr = output<void>();
  documentos = output<any>();
  serviceHistory = output<any>();
  bitacora = output<any>();
  fichaTecnica = output<any>();
  equipmentContents = output<any>();
  maintenanceCalendar = output<any>();
  deleteOrder = output<any>();
  edit = output<any>();
  delete = output<any>();
}
