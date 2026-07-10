import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { map } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { MisInspeccionesAgregarImagenes } from "src/app/features/operations/inspecciones-y-auditora/inspection/bitacora/mis-inspecciones-agregar-imagenes";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-mis-inspecciones-ejecutar",
  imports: [
    WebButtonIcon,
    CommonModule,
    ReactiveFormsModule,
    CustomInputToggleSwitch,
    CustomInputTextAreaSignal,
    AppImage,
    WebButtonLabel,
    TooltipModule,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mis-inspecciones-ejecutar.html",
})
export class MisInspeccionesEjecutar implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiResponseS = inject(ApiResponseService);
  autS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  private breakpointObserver = inject(BreakpointObserver);

  customerInspectionId: string | null = null;
  applicationUserId = this.autS.applicationUserId;
  customerId = this.customerIdS.customerId;

  dataSignal = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  private paramsSignal = toSignal(this.activatedRoute.paramMap);

  isMobileView = toSignal(
    this.breakpointObserver
      .observe(["(max-width: 768px)"])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  flattenedData = computed(() => {
    const data = this.dataSignal();
    const flattened: any[] = [];
    data.forEach((area: any) => {
      area.items.forEach((item: any) => {
        flattened.push({
          ...item,
          condominiumAssetName: area.condominiumAssetName,
        });
      });
    });
    return flattened;
  });

  groupedData = computed(() => {
    const data = this.dataSignal();
    const grouped: any = {};
    data.forEach((area: any) => {
      grouped[area.condominiumAssetName] = area.items;
    });
    return grouped;
  });

  globalFilterFields = computed(() => [
    "inspectionDescription",
    "condominiumAssetName",
  ]);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        this.customerInspectionId = params.get("customerInspectionId");
        if (this.customerInspectionId) {
          this.onLoadData(this.customerInspectionId);
        }
      }
    });
  }

  ngOnInit(): void {}

  onLoadData(customerInspectionId: string): void {
    this.apiResponseS
      .onGetList(
        Endpoints.InspectionResults.getByIdForExecution(customerInspectionId),
      )
      .then((response: any) => {
        const processedData = response.map((area: any) => ({
          ...area,
          items: area.items.map((revision: any) => ({
            ...revision,
            stateControl: new FormControl(revision.state),
            observationsControl: new FormControl(revision.observations || ""),
          })),
        }));
        this.dataSignal.set(processedData);
      });
  }

  saveRevision(revision: any): void {
    const revisionData = {
      id: revision.id,
      state: revision.stateControl.value,
      observations: revision.observationsControl.value || "",
    };

    this.apiResponseS
      .onPost(
        Endpoints.InspectionResults.updateInspectionData(
          this.customerInspectionId!,
          this.applicationUserId,
        ),
        [revisionData],
      )
      .then((result: any) => {
        console.log("Datos guardados exitosamente", result);
      })
      .catch((error) => {
        console.error("Error al guardar revisión:", error);
      });
  }

  onSubmit(): void {
    const data = this.dataSignal();
    if (!Array.isArray(data)) {
      console.error("Datos no son un arreglo:", data);
      return;
    }

    const inspectionUpdates = data.flatMap((area: any) =>
      area.items.map((revision: any) => ({
        id: revision.id,
        state: revision.stateControl.value,
        observations: revision.observationsControl.value || "",
      })),
    );

    this.apiResponseS
      .onPost(
        Endpoints.InspectionResults.updateInspectionData(
          this.customerInspectionId!,
          this.applicationUserId,
        ),
        inspectionUpdates,
      )
      .then(() => {})
      .catch((error) => {
        console.error("Error al enviar datos:", error);
      });
  }

  onModalAddImages(inspectionResultId: string) {
    this.dialogHandlerS
      .openDialog(
        MisInspeccionesAgregarImagenes,
        { inspectionResultId },
        "Agregar imígenes",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData(this.customerInspectionId!);
      });
  }
}
