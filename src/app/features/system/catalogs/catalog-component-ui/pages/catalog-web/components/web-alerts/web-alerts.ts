import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/status-badge/status-badge";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { ActionIconsGroupComponent } from "src/app/core/components/action-icons-group/action-icons-group.component";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-web-alerts",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    TooltipModule,
    StatusBadge,
    ActionMenu,
    ActionIconsGroupComponent,
    AppIcon,
  ],
  template: `
    <p-card header="Navigation & Overlays">
      <div class="flex flex-wrap gap-4 align-items-center">
        <div class="flex flex-column gap-2">
          <span class="font-bold text-sm">Status Badge System</span>
          <div class="flex gap-2">
            <app-status-badge [status]="EStatus.Pendiente" />
            <app-status-badge [status]="EStatus.Proceso" />
            <app-status-badge [status]="EStatus.Concluido" />
            <app-status-badge [status]="EStatus.noAutorizado" />
          </div>
        </div>

        <p-divider layout="vertical" class="hidden md:block"></p-divider>

        <div class="flex flex-column gap-2">
          <span class="font-bold text-sm">Contextual Menu</span>
          <app-action-menu [mobileMode]="false">
            <p-button label="Ver Detalle" icon="mdi:magnify" [text]="true" />
            <p-button label="Exportar" icon="mdi:file-pdf-box" [text]="true" />
            <p-button label="Eliminar" icon="mdi:delete" [text]="true" severity="danger" />
          </app-action-menu>
        </div>

        <p-divider layout="vertical" class="hidden md:block"></p-divider>

        <div class="flex flex-column gap-2">
          <span class="font-bold text-sm">Icons Group</span>
          <app-action-icons-group>
            <app-icon [icon]="'pencil'" class="p-2 cursor-pointer hover:text-primary" />
            <app-icon [icon]="'trash'" class="p-2 cursor-pointer hover:text-danger" />
            <app-icon [icon]="'copy'" class="p-2 cursor-pointer hover:text-primary" />
          </app-action-icons-group>
        </div>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebAlerts {
  EStatus = EStatus;
}
