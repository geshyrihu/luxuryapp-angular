import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import {
  SegmentedControl,
  SegmentItem,
} from "@ui/primitives/segmented-control/segmented-control";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-mobile",
  imports: [
    ButtonMobile,
    LxIcon,
    ReactiveFormsModule,
    LxTag,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    SegmentedControl,
    IonInputText,
  ],
  templateUrl: "./send-operation-report-mobile.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SendOperationReportMobile {
  service = inject(SendOperationReportBaseService);

  segmentItems: SegmentItem[] = [
    { value: "seleccionar", label: "Todos", icon: "material-symbols-light:check-box" },
    { value: "desmarcar", label: "Ninguno", icon: "material-symbols-light:cancel" },
    { value: "PARA", label: "PARA", icon: "material-symbols-light:mail-outline" },
    { value: "CC", label: "CC", icon: "material-symbols-light:mail-outline" },
    { value: "CCO", label: "CCO", icon: "material-symbols-light:mail-off-outline" },
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

