import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { IRecepcionPipaAgua } from "../recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-list-mobile",
  templateUrl: "./recepcion-pipas-agua-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    RouterModule,
    MobileActionMenu,
    MobileButtonLabelDownload,
    ButtonMobile,
    MobileButtonLabelDelete,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
})
export class RecepcionPipasAguaListMobile {
  data = input.required<IRecepcionPipaAgua[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
  downloadPdf = output<IRecepcionPipaAgua>();
}
