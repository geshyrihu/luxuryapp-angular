import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import {
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
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { TooltipModule } from "primeng/tooltip";
import { map } from "rxjs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { MisInspeccionesAgregarImagenes } from "src/app/features/inspection/bitacora/mis-inspecciones-agregar-imagenes";

@Component({
  selector: "app-mis-inspecciones-ejecutar",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CustomInputTextAreaSignal,
    ImageModule,
    CustomButton,
    TooltipModule,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
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
      .onGetList(Endpoints.InspectionResults.getByIdForExecution(customerInspectionId))
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
        "Agregar imágenes",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData(this.customerInspectionId!);
      });
  }
}
