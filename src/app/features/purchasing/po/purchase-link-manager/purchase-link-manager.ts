import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TooltipModule } from "primeng/tooltip";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Component({
  selector: "app-purchase-link-manager",
  templateUrl: "./purchase-link-manager.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    WebButtonLabel,
    CustomInputTextSignal,
    TooltipModule,
    DragDropModule,
    CustomInputSelectButton,
    AppIcon,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseLinkManager implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  // Data Signals
  solicitudes = signal<any[]>([]);
  ordenes = signal<any[]>([]);
  loadingSolicitudes = signal(false);
  loadingOrdenes = signal(false);
  isDragging = signal(false); // Para optimizar CSS

  // Filters
  statusOptions = [
    { label: "Pendientes", value: 2 },
    { label: "Autorizadas", value: 0 },
    { label: "Denegadas", value: 1 },
  ];

  statusSCControl = new FormControl<number>(2);
  statusOCControl = new FormControl<number>(2);
  searchSCControl = new FormControl<string>("");
  searchOCControl = new FormControl<string>("");

  statusSC = signal(2);
  statusOC = signal(2);
  searchSC = signal("");
  searchOC = signal("");

  constructor() {
    this.searchSCControl.valueChanges.subscribe((v) =>
      this.searchSC.set(v || ""),
    );
    this.statusSCControl.valueChanges.subscribe((v) => {
      this.statusSC.set(v ?? 2);
      this.onLoadSolicitudes();
    });
    this.searchOCControl.valueChanges.subscribe((v) =>
      this.searchOC.set(v || ""),
    );
    this.statusOCControl.valueChanges.subscribe((v) => {
      this.statusOC.set(v ?? 2);
      this.onLoadOrdenes();
    });
  }

  filteredSolicitudes = computed(() => {
    const search = this.searchSC().toLowerCase();
    return this.solicitudes().filter(
      (s) =>
        !search ||
        s.folio?.toLowerCase().includes(search) ||
        s.equipoOInstalacion?.toLowerCase().includes(search) ||
        s.justificacionGasto?.toLowerCase().includes(search),
    );
  });

  filteredOrdenes = computed(() => {
    const search = this.searchOC().toLowerCase();
    const status = this.statusOC();
    return this.ordenes().filter(
      (o) =>
        o.estatus === status &&
        (!search ||
          o.folio?.toLowerCase().includes(search) ||
          o.equipoOInstalacion?.toLowerCase().includes(search) ||
          o.justificacionGasto?.toLowerCase().includes(search)),
    );
  });

  ngOnInit(): void {
    this.onLoadSolicitudes();
    this.onLoadOrdenes();
  }

  onLoadSolicitudes() {
    this.loadingSolicitudes.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.PurchaseRequests.listSolicitudCompraByCustomerAndStatus(
          this.customerIdS.customerId(),
          this.statusSC(),
        ),
      )
      .then((result: any) => {
        this.solicitudes.set(result || []);
        this.loadingSolicitudes.set(false);
      });
  }

  onLoadOrdenes() {
    this.loadingOrdenes.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.PurchaseOrders.linkManagerList(this.customerIdS.customerId()),
      )
      .then((result: any[]) => {
        this.ordenes.set(result || []);
        this.loadingOrdenes.set(false);
      });
  }

  onLink(ordenCompraId: string, solicitudCompraId: string) {
    this.apiResponseS
      .onPut(
        Endpoints.PurchaseOrders.linkToRequest(
          ordenCompraId,
          solicitudCompraId,
        ),
        {},
      )
      .then((success) => {
        if (success) {
          this.onLoadSolicitudes();
          this.onLoadOrdenes();
        }
      });
  }

  onUnlink(ordenCompraId: string) {
    this.apiResponseS
      .onPut(Endpoints.PurchaseOrders.unlinkSolicitud(ordenCompraId), {})
      .then((success) => {
        if (success) {
          this.onLoadSolicitudes();
          this.onLoadOrdenes();
        }
      });
  }

  // Drag Handlers
  dragStarted() {
    this.isDragging.set(true);
  }
  dragEnded() {
    this.isDragging.set(false);
  }

  onDropOnSolicitud(event: CdkDragDrop<any>, targetSolicitud: any) {
    const source = event.item.data;
    // Si arrastramos una OC (naranja) a una SC (verde)
    if (source.folio.startsWith("OC") && targetSolicitud.id) {
      this.onLink(source.id, targetSolicitud.id);
    }
  }

  onDropOnOrder(event: CdkDragDrop<any>, targetOrder: any) {
    const source = event.item.data;
    // Si arrastramos una SC (verde) a una OC (naranja)
    if (!source.folio.startsWith("OC") && targetOrder.id) {
      this.onLink(targetOrder.id, source.id);
    }
  }

  onClose() {
    this.ref.close(true);
  }
}
