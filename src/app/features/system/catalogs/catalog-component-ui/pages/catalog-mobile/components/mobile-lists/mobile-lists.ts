import { CommonModule } from "@angular/common";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { IonBadge, IonButton, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, IonSearchbar } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addOutline, createOutline, searchOutline, trashOutline } from "ionicons/icons";

@Component({
  selector: "app-mobile-lists",
  standalone: true,
  imports: [CommonModule, IonBadge, IonButton, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, IonSearchbar],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Ionic List Patterns</div>
      <div class="mobile-card-body flex flex-column gap-4">
        <div>
          <div class="font-bold text-sm mb-2">Sliding Items (Swipe Actions)</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-item-sliding>
              <ion-item>
                <ion-label>
                  <strong>Solicitud de Compra</strong>
                  <p class="text-xs text-secondary">SC-2026-041</p>
                </ion-label>
                <ion-badge color="warning" slot="end">Pendiente</ion-badge>
              </ion-item>
              <ion-item-options side="start">
                <ion-item-option color="primary" (click)="onEdit()">
                  <ion-icon slot="icon-only" name="create-outline" />
                </ion-item-option>
              </ion-item-options>
              <ion-item-options side="end">
                <ion-item-option color="danger" (click)="onDelete()">
                  <ion-icon slot="icon-only" name="trash-outline" />
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item>
                <ion-label>
                  <strong>Reporte de Inspección</strong>
                  <p class="text-xs text-secondary">RI-2026-009</p>
                </ion-label>
                <ion-badge color="success" slot="end">Cerrado</ion-badge>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="danger">
                  <ion-icon slot="icon-only" name="trash-outline" />
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Reorderable List</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-reorder-group [disabled]="false" (ionItemReorder)="onReorder($event)">
              <ion-item>
                <ion-label>Item 1</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
              <ion-item>
                <ion-label>Item 2</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
              <ion-item>
                <ion-label>Item 3</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
            </ion-reorder-group>
          </ion-list>
        </div>
      </div>
        <!-- ─── PATRÓN: Lista con Buscador + Botón Agregar ─── -->
        <div class="mt-4">
          <div class="font-bold text-sm mb-3">Patrón: Buscador + Lista + Agregar (estándar ERP)</div>

          <!-- Barra de búsqueda + botón -->
          <div class="flex align-items-center gap-2 mb-2">
            <ion-searchbar
              [value]="searchTerm()"
              (ionInput)="searchTerm.set($any($event).target.value)"
              placeholder="Buscar registro..."
              class="flex-grow-1 p-0"
              animated="true"
              style="--border-radius:10px;">
            </ion-searchbar>
            <ion-button size="small" color="primary" (click)="onAdd()">
              <ion-icon name="add-outline" slot="icon-only"></ion-icon>
            </ion-button>
          </div>

          <!-- Conteo filtrado -->
          <p class="text-xs m-0 mb-1" style="color:var(--ds-text-muted);">
            {{ filteredItems().length }} registro{{ filteredItems().length !== 1 ? 's' : '' }}
          </p>

          <!-- Lista agrupada con ion-list-header + ion-item-divider -->
          <ion-list style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">

            <ion-list-header>
              <ion-label class="text-xs font-bold uppercase" style="color:var(--ds-text-secondary);">
                Activos
              </ion-label>
            </ion-list-header>

            @for (item of filteredItems(); track item.id) {
              <ion-item lines="full">
                <ion-label>
                  <h3 class="font-semibold m-0">{{ item.name }}</h3>
                  <p class="text-xs m-0 mt-1" style="color:var(--ds-text-secondary);">{{ item.code }}</p>
                </ion-label>
                <ion-badge [color]="item.status === 'Activo' ? 'success' : 'warning'" slot="end">
                  {{ item.status }}
                </ion-badge>
              </ion-item>
            } @empty {
              <ion-item lines="none">
                <ion-label class="text-center text-xs" style="color:var(--ds-text-muted);">
                  Sin resultados para "{{ searchTerm() }}"
                </ion-label>
              </ion-item>
            }

            <ion-item-divider>
              <ion-label class="text-xs font-bold uppercase" style="color:var(--ds-text-secondary);">
                Inactivos
              </ion-label>
            </ion-item-divider>

            <ion-item lines="none">
              <ion-label class="text-xs" style="color:var(--ds-text-muted);">
                No hay registros inactivos.
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileLists {
  onEdit(): void {
    console.log("Edit clicked");
  }

  onDelete(): void {
    console.log("Delete clicked");
  }

  onReorder(event: CustomEvent): void {
    event.detail.complete();
  }

  // ─── Search + Add pattern ───
  searchTerm = signal<string>("");

  private readonly allItems = [
    { id: 1, name: "Bomba Hidroneumática",   code: "EQ-001", status: "Activo" },
    { id: 2, name: "Generador de Emergencia", code: "EQ-002", status: "Activo" },
    { id: 3, name: "Elevador Torre A",        code: "EQ-003", status: "Activo" },
    { id: 4, name: "Cisterna Principal",      code: "EQ-004", status: "Activo" },
  ];

  filteredItems = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q ? this.allItems.filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q))
             : this.allItems;
  });

  onAdd(): void { console.log("Agregar nuevo registro"); }

  constructor() {
    addIcons({ addOutline, createOutline, searchOutline, trashOutline });
  }
}
