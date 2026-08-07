import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelAdd } from "@ui/buttons/mobile-label/button-add";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import {
  SegmentedControl,
  SegmentItem,
} from "@ui/shared/segmented-control/segmented-control";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-mobile",
  imports: [
    AppIcon,
    ReactiveFormsModule,
    LxTag,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    SegmentedControl,
    MobileButtonLabelConfirm,
    MobileButtonLabelAdd,
    IonInputText,
  ],
  templateUrl: "./send-operation-report-mobile.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SendOperationReportMobile {
  service = inject(SendOperationReportBaseService);

  segmentItems: SegmentItem[] = [
    { value: "seleccionar", label: "Todos", icon: "mdi:checkbox-marked" },
    { value: "desmarcar", label: "Ninguno", icon: "mdi:close-circle" },
    { value: "PARA", label: "PARA", icon: "mdi:email-arrow-right" },
    { value: "CC", label: "CC", icon: "mdi:email-outline" },
    { value: "CCO", label: "CCO", icon: "mdi:email-off-outline" },
  ];

  onSegmentChange(value: string): void {
    if (value === "seleccionar") {
      this.service.onSelectAll();
    } else if (value === "desmarcar") {
      this.service.onDeselecteAll();
    } else {
      const isPara = value === "PARA";
      const isCc = value === "CC";
      const isCco = value === "CCO";
      this.service.onMostrarInput(isPara, isCc, isCco, value);
    }
  }
}
