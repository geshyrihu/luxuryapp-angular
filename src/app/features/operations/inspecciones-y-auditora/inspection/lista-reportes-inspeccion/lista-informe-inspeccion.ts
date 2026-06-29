import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ImageModule } from "primeng/image";
import { TooltipModule } from "primeng/tooltip";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { InspeccionPdfService } from "../inspeccion-pdf.service";

@Component({
  selector: "app-lista-informe-inspeccion",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomButton,
    CustomInputDateSignal,
    CardModule,
    ImageModule,
    TooltipModule,
  ],
  templateUrl: "./lista-informe-inspeccion.html",
})
export class ListaInformeInspeccion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  inspeccionPdfS = inject(InspeccionPdfService);

  dataSignal = signal<any>(null);
  inspectionResultIdControl = new FormControl<string>("");
  inspectionResultSignal = signal<ISelectItem[]>([]);
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
      .onGetSelectItem<
        ISelectItem[]
      >(Endpoints.CustomerInspections.selectByCustomer(this.customerIdS.customerId()))
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
