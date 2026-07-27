import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LxTag } from "@ui/adaptive/tag/tag";
import {
  AspelDataSource,
  AspelLocalStatusResponse,
  SelectItem,
} from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus-source-toolbar",

  imports: [FormsModule, LxTag, CustomInputSelectSignal, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div
      class="flex flex-column xl:flex-row justify-content-between align-items-start gap-3 p-4 rounded-xl border-1 surface-border bg-white"
    >
      <div class="grid w-full m-0">
        <div class="col-12 xl:col-4">
          <custom-input-select-signal
            label="Fuente de consulta"
            [ngModel]="dataSource"
            [data]="dataSourceOptions"
            [horizontal]="false"
            [noMargin]="true"
            (ngModelChange)="dataSourceChange.emit($event)"
          />
          <small class="text-500">
            Live consulta Aspel en tiempo real. Local usa el snapshot
            sincronizado.
          </small>
        </div>

        <div class="col-12 xl:col-8">
          <div class="flex flex-column gap-2">
            <div class="flex flex-wrap gap-2">
              <il-button
                label="Sync cobranza"
                iconClass="mdi:database-sync-outline"
                [loading]="syncing"
                [disabled]="syncing || !customerId"
                customClass="p-button-secondary"
                (clicked)="syncCobranza.emit()"
              />
              <il-button
                label="Sync completa"
                iconClass="mdi:sync"
                [loading]="syncing"
                [disabled]="syncing || !customerId"
                customClass="p-button-secondary"
                (clicked)="syncCompleta.emit()"
              />
              <il-button
                label="Status local"
                iconClass="mdi:server-outline"
                [loading]="statusLoading"
                [disabled]="statusLoading || !customerId"
                customClass="p-button-secondary"
                (clicked)="refreshStatus.emit()"
              />
            </div>

            <div class="flex flex-wrap align-items-center gap-2 text-sm">
              <span class="text-600">Customer:</span>
              <lx-tag
                [value]="customerId || 'Sin contexto'"
                severity="secondary"
              />
              <lx-tag [value]="'Año sync: ' + syncYear" severity="info" />
              @if (localStatus) {
                <lx-tag
                  [value]="
                    localStatus.snapshotReady
                      ? 'Snapshot listo'
                      : 'Snapshot incompleto'
                  "
                  [severity]="localStatus.snapshotReady ? 'success' : 'warn'"
                />
                <span class="text-500">
                  Ctas {{ localStatus.totalAccounts }} · Saldos
                  {{ localStatus.totalBalances }} · Pólizas
                  {{ localStatus.totalPolicies }} · Aux
                  {{ localStatus.totalMovements }}
                </span>
              }
            </div>

            @if (dataSource === "local" && localStatus?.notes) {
              <small class="text-500">{{ localStatus.notes }}</small>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AspelCobranzaHausSourceToolbar {
  @Input({ required: true }) customerId = "";
  @Input({ required: true }) dataSource!: AspelDataSource;
  @Input({ required: true }) dataSourceOptions: SelectItem<AspelDataSource>[] =
    [];
  @Input({ required: true }) syncYear = new Date().getFullYear();
  @Input() syncing = false;
  @Input() statusLoading = false;
  @Input() localStatus: AspelLocalStatusResponse | null = null;

  @Output() dataSourceChange = new EventEmitter<AspelDataSource>();
  @Output() syncCobranza = new EventEmitter<void>();
  @Output() syncCompleta = new EventEmitter<void>();
  @Output() refreshStatus = new EventEmitter<void>();
}
