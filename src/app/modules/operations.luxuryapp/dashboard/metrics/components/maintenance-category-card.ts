import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceOrdersCategoryItemDto } from '../interfaces/maintenance-orders.dto';
import { AppIcon as AppIconComponent } from "@ui/shared/app-icon/app-icon";
import { AppIcon, AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

@Component({
  selector: 'app-maintenance-category-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card h-100" style="background-color: var(--ds-bg-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-sm);">
      <div class="card-body">
        <h5 class="card-title d-flex align-items-center mb-3" style="color: var(--ds-text-primary);">
          <app-icon [icon]="getIcon()" class="me-2"></app-icon>
          {{ item().category }}
        </h5>
        
        <div class="mb-4">
          <div class="d-flex flex-column">
            <span style="font-size: var(--ds-font-size-help); color: var(--ds-text-secondary);">Solicitudes totales</span>
            <span style="font-size: var(--ds-font-size-metric); color: var(--ds-text-primary); font-weight: bold;">
              {{ item().total }}
            </span>
          </div>
        </div>

        <div class="row g-2 text-center">
          <div class="col-4">
            <div class="d-flex flex-column align-items-center">
              <span style="font-size: var(--ds-font-size-micro); color: var(--ds-text-muted);">Pendientes</span>
              <span style="font-size: var(--ds-font-size-help); color: var(--ds-warning); font-weight: 500;">
                {{ item().pending }}
              </span>
            </div>
          </div>
          <div class="col-4" style="border-left: 1px solid var(--ds-border); border-right: 1px solid var(--ds-border);">
            <div class="d-flex flex-column align-items-center">
              <span style="font-size: var(--ds-font-size-micro); color: var(--ds-text-muted);">Concluidas</span>
              <span style="font-size: var(--ds-font-size-help); color: var(--ds-success); font-weight: 500;">
                {{ item().completed }}
              </span>
            </div>
          </div>
          <div class="col-4">
            <div class="d-flex flex-column align-items-center" [title]="'Pendientes de meses anteriores a ' + monthName()">
              <span style="font-size: var(--ds-font-size-micro); color: var(--ds-text-muted);">Pendientes pasados</span>
              <span style="font-size: var(--ds-font-size-help); font-weight: 500;" [style.color]="item().pastPending > 0 ? 'var(--ds-danger)' : 'var(--ds-text-muted)'">
                {{ item().pastPending }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceCategoryCardComponent {
  item = input.required<MaintenanceOrdersCategoryItemDto>();
  monthName = input.required<string>();

  getIcon(): AppIconName {
    const categoryId = this.item().categoryId;
    switch (categoryId) {
      case 1: return AppIcon.Tools; // Equipos
      case 2: return AppIcon.Pool; // Amenidades
      case 3: return AppIcon.Table; // Mobiliarios
      case 4: return AppIcon.Box; // Equipamiento
      case 5: return AppIcon.Heart; // Gimnasio
      case 6: return AppIcon.Monitor; // Sistemas
      case 7: return AppIcon.Warehouse; // Bodegas
      case 8: return AppIcon.AccountGroup; // Areas Comunes
      default: return AppIcon.Tools;
    }
  }
}
