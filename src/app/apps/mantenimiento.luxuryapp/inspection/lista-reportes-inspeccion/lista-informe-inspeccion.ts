import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AppImage } from "@ui/web/image/image";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { InspeccionPdfService } from "../inspeccion-pdf.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-lista-informe-inspeccion",
  imports: [
    AppIcon,
    WebButtonIcon,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    AppImage,
    LxTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./lista-informe-inspeccion.html",
})
export class ListaInformeInspeccion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  inspeccionPdfS = inject(InspeccionPdfService);

  dataSignal = signal<any>(null);
  inspectionResultIdControl = new FormControl<string>("");
  inspectionResultSignal = signal<SelectItemDto[]>([]);
  dateControl = new FormControl<string>("");

  ngOnInit(): void {
    this.dateControl.setValue(this.dateS.getDateFormat(new Date()), {
      emitEvent: false,
    });
    this.onLoadInspectionReport();
  }

  onDateChange(value: any): void {
    this.onLoadData(this.inspectionResultIdControl.value ?? "", value);
  }

  onLoadData(inspectionResultId: string, date: string): void {
    this.apiResponseS
      .onGetList(Endpoints.InspectionResults.report(inspectionResultId, date))
      .then((result: any) => this.dataSignal.set(result));
  }

  onReload(): void {
    this.onLoadData(
      this.inspectionResultIdControl.value ?? "",
      this.dateControl.value ?? "",
    );
  }

  onLoadInspectionReport(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.CustomerInspections.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => this.inspectionResultSignal.set(result));
  }

  onExportPDF(): void {
    const inspectionId = this.inspectionResultIdControl.value ?? "";
    const dateVal = this.dateControl.value ?? "";
    const nombre = `Inspeccion_${inspectionId}${dateVal ? "_" + dateVal : ""}`;

    this.apiResponseS
      .onGetList(Endpoints.InspectionResults.report(inspectionId, dateVal))
      .then((data: any) => this.inspeccionPdfS.generarReporte(data, nombre));
  }
}
