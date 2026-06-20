import { CommonModule } from "@angular/common";
import { Component, input, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

interface GroupItem {
  id: number;
  title: string;
  module: string;
  status: string;
}

@Component({
  selector: "app-mobile-lists",
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, AppIcon],
  template: `
    <p-card header="Grouped Data List (Mobile Pattern)">
      @for (group of groupedDataExample() | keyvalue; track group.key) {
        <div class="mb-3">
          <div class="font-bold text-sm text-primary mb-2 flex align-items-center gap-2">
            <app-icon [icon]="'calendar-clock'" />
            <span>{{ group.key }}</span>
          </div>
          @for (item of group.value; track item.id) {
            <div class="surface-card border-1 surface-border border-round p-3 mb-2 flex align-items-center justify-content-between">
              <div>
                <span class="font-bold text-sm block">{{ item.title }}</span>
                <span class="text-xs text-secondary">{{ item.module }}</span>
              </div>
              <p-tag
                [value]="item.status"
                [severity]="item.status === 'Urgente' ? 'danger' : item.status === 'Proceso' ? 'info' : 'warn'"
              ></p-tag>
            </div>
          }
        </div>
      }
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileLists {
  groupedDataExample = input<Record<string, GroupItem[]>>({
    "Hoy (23 Abr)": [
      { id: 1, title: "Revisión de Extintores", module: "Mantenimiento", status: "Pendiente" },
      { id: 2, title: "Corte de Caja Diario", module: "Finanzas", status: "Proceso" },
    ],
    "Mañana (24 Abr)": [
      { id: 3, title: "Junta de Comité", module: "Administración", status: "Urgente" },
    ],
  });
}
