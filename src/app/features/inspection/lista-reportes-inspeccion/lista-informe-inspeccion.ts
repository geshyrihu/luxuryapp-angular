import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ImageModule } from "primeng/image";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
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
  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);

  inspectionResultIdControl = new FormControl<string>("");
  inspectionResultSignal = signal<ISelectItem[]>([]);
  dateControl = new FormControl<string>("");

  ngOnInit(): void {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajuste de zona horaria
    this.dateControl.setValue(today.toISOString().split("T")[0], {
      emitEvent: false,
    }); // Formato YYYY-MM-DD
    this.onLoadInspectionReport();
  }
  onDateChange(value: any) {
    this.onLoadData(this.inspectionResultIdControl.value || "", value);
  }
  onLoadData(inspectionResultId: string, date: string): void {
    this.apiResponseS
      .onGetList(Endpoints.InspectionResults.report(inspectionResultId, date))
      .then((result: any) => this.dataSignal.set(result));
  }
  onReload() {
    this.onLoadData(
      this.inspectionResultIdControl.value || "",
      this.dateControl.value || "",
    );
  }

  onLoadInspectionReport() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(
        Endpoints.CustomerInspections.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.inspectionResultSignal.set(result);
      });
  }

  onExportPDF() {
    const inspectionId = this.inspectionResultIdControl.value || "";
    const dateVal = this.dateControl.value || "";
    const nameDocument = `Inspección_${inspectionId}.pdf`; // Nombre del archivo

    this.apiResponseS.onDownloadFile(
      Endpoints.InspectionResults.exportPdf(inspectionId, dateVal),
      nameDocument,
    );
  }
}
