import { CommonModule } from "@angular/common";
import { Component, input, ViewEncapsulation } from "@angular/core";
import { IonBadge } from "@ionic/angular/standalone";
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
  imports: [CommonModule, IonBadge, AppIcon],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Grouped Data List (Mobile Pattern)</div>
      <div class="mobile-card-body">
        @for (group of groupedDataExample() | keyvalue; track group.key) {
          <div class="mb-3">
            <div class="font-bold text-sm text-primary mb-2 flex align-items-center gap-2">
              <app-icon [icon]="'calendar-clock'" />
              <span>{{ group.key }}</span>
            </div>
            @for (item of group.value; track item.id) {
              <div class="list-item">
                <div>
                  <span class="font-bold text-sm block">{{ item.title }}</span>
                  <span class="text-xs text-secondary">{{ item.module }}</span>
                </div>
                <ion-badge
                  [color]="item.status === 'Urgente' ? 'danger' : item.status === 'Proceso' ? 'primary' : 'warning'"
                >{{ item.status }}</ion-badge>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
    .list-item { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); padding: 0.75rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between; }
  `],
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
