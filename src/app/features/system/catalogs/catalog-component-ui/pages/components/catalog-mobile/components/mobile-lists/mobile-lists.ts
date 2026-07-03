import { CommonModule } from "@angular/common";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonBadge,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonReorder,
  IonReorderGroup,
  IonRippleEffect,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addOutline,
  callOutline,
  chatbubbleOutline,
  checkmarkCircleOutline,
  closeOutline,
  createOutline,
  flagOutline,
  searchOutline,
  starOutline,
  timeOutline,
  trashOutline,
  warningOutline,
} from "ionicons/icons";
import { MOBILE_SHOWCASE_STYLES } from "../../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-lists",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCheckbox,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonListHeader,
    IonReorder,
    IonReorderGroup,
    IonRippleEffect,
    IonSearchbar,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Ionic List Patterns</div>
      <div class="mobile-card-body flex flex-column gap-4">
        <div>
          <div class="font-bold text-sm mb-2">
            Sliding Items (Swipe Actions)
          </div>
          <ion-list
            lines="full"
            style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;"
          >
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
          <ion-list
            lines="full"
            style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;"
          >
            <ion-reorder-group
              [disabled]="false"
              (ionItemReorder)="onReorder($event)"
            >
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
      <!-- --- PATRóN: Lista con Buscador + Botón Agregar --- -->
      <div class="mt-4">
        <div class="font-bold text-sm mb-3">
          Patrón: Buscador + Lista + Agregar (esténdar ERP)
        </div>

        <!-- Barra de bósqueda + botón -->
        <div class="flex align-items-center gap-2 mb-2">
          <ion-searchbar
            [value]="searchTerm()"
            (ionInput)="searchTerm.set($any($event).target.value)"
            placeholder="Buscar registro..."
            class="flex-grow-1 p-0"
            animated="true"
            style="--border-radius:10px;"
          >
          </ion-searchbar>
          <ion-button size="small" color="primary" (click)="onAdd()">
            <ion-icon name="add-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <!-- Conteo filtrado -->
        <p class="text-xs m-0 mb-1" style="color:var(--ds-text-muted);">
          {{ filteredItems().length }} registro{{
            filteredItems().length !== 1 ? "s" : ""
          }}
        </p>

        <!-- Lista agrupada con ion-list-header + ion-item-divider -->
        <ion-list
          style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;"
        >
          <ion-list-header>
            <ion-label
              class="text-xs font-bold uppercase"
              style="color:var(--ds-text-secondary);"
            >
              Activos
            </ion-label>
          </ion-list-header>

          @for (item of filteredItems(); track item.id) {
            <ion-item lines="full">
              <ion-label>
                <h3 class="font-semibold m-0">{{ item.name }}</h3>
                <p
                  class="text-xs m-0 mt-1"
                  style="color:var(--ds-text-secondary);"
                >
                  {{ item.code }}
                </p>
              </ion-label>
              <ion-badge
                [color]="item.status === 'Activo' ? 'success' : 'warning'"
                slot="end"
              >
                {{ item.status }}
              </ion-badge>
            </ion-item>
          } @empty {
            <ion-item lines="none">
              <ion-label
                class="text-center text-xs"
                style="color:var(--ds-text-muted);"
              >
                Sin resultados para "{{ searchTerm() }}"
              </ion-label>
            </ion-item>
          }

          <ion-item-divider>
            <ion-label
              class="text-xs font-bold uppercase"
              style="color:var(--ds-text-secondary);"
            >
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
      <!-- ion-ripple-effect -->
      <div class="mt-4 px-1">
        <div class="font-bold text-sm mb-1">
          Ripple Effect (ion-ripple-effect)
        </div>
        <p class="text-xs text-secondary mb-2">
          Efecto material al tocar. Requiere <code>position:relative</code> +
          <code>overflow:hidden</code> en el padre.
        </p>
        <div class="flex flex-column gap-2">
          <div
            class="ripple-item ion-activatable"
            (click)="onRippleTap('primario')"
          >
            <span>Elemento con ripple primario</span>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
          <div
            class="ripple-item ripple-danger ion-activatable"
            (click)="onRippleTap('peligro')"
          >
            <span>Acción de eliminación</span>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
          <div
            class="ripple-item ripple-success ion-activatable"
            (click)="onRippleTap('óxito')"
          >
            <span>Acción de confirmación</span>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
        </div>
        @if (lastRipple()) {
          <p class="text-xs text-secondary mt-1">
            Tocaste: <strong>{{ lastRipple() }}</strong>
          </p>
        }
      </div>

      <!-- --- PATRóN: Task List (ui-stiich Corporate Integrity) --- -->
      <div class="stiich-section">
        <div class="stiich-section__header">
          <span class="stiich-section__eyebrow">Corporate Integrity</span>
          <h4 class="stiich-section__title">Task List é listado de tareas</h4>
        </div>
        <p class="stiich-section__desc">
          Lista de tareas con prioridad, estado y fecha lómite. Inspirado en
          <code>listado_de_tareas_modo_claro</code>.
        </p>
        <div class="stiich-card">
          <div class="stiich-card__header">
            <span class="material-symbols-outlined stiich-card__icon"
              >assignment</span
            >
            <span class="stiich-card__title"
              >Proyecto: Remodelación Torre B</span
            >
            <span class="stiich-card__badge stiich-badge--warning"
              >3 pendientes</span
            >
          </div>
          <div class="stiich-divider"></div>
          @for (task of tasks(); track task.id) {
            <div class="stiich-task" [class.stiich-task--done]="task.completed">
              <ion-checkbox
                [checked]="task.completed"
                (ionChange)="toggleTask(task.id)"
                labelPlacement="end"
                justify="start"
                class="stiich-task__checkbox"
              >
                <span [class.stiich-task__text--done]="task.completed">{{
                  task.title
                }}</span>
              </ion-checkbox>
              <div class="stiich-task__meta">
                @if (task.priority === "high") {
                  <span class="stiich-chip stiich-chip--danger">Alta</span>
                } @else if (task.priority === "medium") {
                  <span class="stiich-chip stiich-chip--warning">Media</span>
                } @else {
                  <span class="stiich-chip stiich-chip--info">Baja</span>
                }
                <span class="stiich-task__date">
                  <span class="material-symbols-outlined stiich-icon--sm"
                    >calendar_today</span
                  >
                  {{ task.due }}
                </span>
              </div>
            </div>
            <div class="stiich-divider"></div>
          }
          <div class="stiich-card__footer">
            <button class="stiich-btn stiich-btn--primary stiich-btn--sm">
              <span class="material-symbols-outlined stiich-icon--sm">add</span>
              Agregar tarea
            </button>
            <span class="stiich-card__count">{{ tasks.length }} tareas</span>
          </div>
        </div>
      </div>

      <!-- --- PATRóN: Contacts Directory (ui-stiich Corporate Integrity) --- -->
      <div class="stiich-section">
        <div class="stiich-section__header">
          <span class="stiich-section__eyebrow">Corporate Integrity</span>
          <h4 class="stiich-section__title">
            Contacts Directory é listado de contactos
          </h4>
        </div>
        <p class="stiich-section__desc">
          Directorio corporativo con avatar, nombre, rol y acciones rápidas.
          Inspirado en <code>listado_de_contactos_modo_claro</code>.
        </p>
        <div class="stiich-contacts-card">
          <div class="stiich-contacts-card__header">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined stiich-contacts-card__icon"
                >contacts</span
              >
              <span class="stiich-contacts-card__title"
                >Corporate Directory</span
              >
            </div>
            <button class="stiich-btn-icon">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
          <div class="stiich-divider"></div>
          @for (contact of contacts; track contact.id) {
            <div class="stiich-contact">
              <div class="stiich-contact__avatar-wrap">
                <div
                  class="stiich-contact__avatar"
                  [style.background]="contact.color"
                >
                  <span>{{ contact.initials }}</span>
                </div>
                <div
                  class="stiich-contact__status"
                  [class.stiich-contact__status--online]="contact.online"
                ></div>
              </div>
              <div class="stiich-contact__info">
                <span class="stiich-contact__name">{{ contact.name }}</span>
                <span class="stiich-contact__role">{{ contact.role }}</span>
              </div>
              <div class="stiich-contact__actions">
                <button
                  class="stiich-btn-icon"
                  (click)="onChat(contact.name)"
                  title="Chat"
                >
                  <span class="material-symbols-outlined">chat</span>
                </button>
                <button
                  class="stiich-btn-icon"
                  (click)="onCall(contact.name)"
                  title="Call"
                >
                  <span class="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
            <div class="stiich-divider"></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    MOBILE_SHOWCASE_STYLES,
    `
      .ripple-item {
        position: relative;
        overflow: hidden;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        background: var(--ds-bg-elevated, #f4f5f8);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid var(--ds-border, #e2e8f0);
        --ripple-color: var(--ds-primary, #00050e);
      }
      .ripple-danger {
        --ripple-color: var(--ds-danger, #ba1a1a);
        background: var(--ds-danger-light, #fef2f2);
      }
      .ripple-success {
        --ripple-color: var(--ds-success, #006837);
        background: var(--ds-success-light, #d1fae5);
      }

      /* -----------------------------------------------
         Corporate Integrity DS é patrones ui-stiich
         ----------------------------------------------- */
      .stiich-section {
        margin-top: 1.5rem;
      }
      .stiich-section__header {
        margin-bottom: 0.25rem;
      }
      .stiich-section__eyebrow {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--ds-primary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stiich-section__desc {
        font-size: 0.75rem;
        color: var(--ds-text-muted);
        margin: 0.25rem 0 0.75rem 0;
        line-height: 1.4;
      }

      .stiich-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .stiich-card__header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--ds-bg-sunken);
      }
      .stiich-card__icon {
        font-size: 1.25rem;
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-card__title {
        font-weight: 600;
        font-size: 0.8125rem;
        color: var(--ds-text-primary);
        flex: 1;
      }
      .stiich-card__badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stiich-badge--warning {
        background: var(--ds-warning-light, #fef3c7);
        color: var(--ds-warning);
      }
      .stiich-card__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
      }
      .stiich-card__count {
        font-size: 0.7rem;
        color: var(--ds-text-secondary);
      }
      .stiich-divider {
        height: 1px;
        background: var(--ds-border-strong);
        opacity: 0.4;
        margin: 0;
      }

      .stiich-task {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 1rem;
      }
      .stiich-task--done {
        opacity: 0.6;
      }
      .stiich-task__checkbox {
        --ion-color-primary: var(--ds-primary-dark, var(--ds-primary));
        --checkmark-color: var(--ds-on-primary);
      }
      .stiich-task__text--done {
        text-decoration: line-through;
        color: var(--ds-text-muted);
      }
      .stiich-task__meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      .stiich-task__date {
        font-size: 0.65rem;
        color: var(--ds-text-secondary);
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .stiich-chip {
        font-size: 0.6rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stiich-chip--danger {
        background: var(--ds-danger-light, #fef2f2);
        color: var(--ds-danger);
      }
      .stiich-chip--warning {
        background: var(--ds-warning-light, #fffbeb);
        color: var(--ds-warning);
      }
      .stiich-chip--info {
        background: var(--ds-info-light, #eff6ff);
        color: var(--ds-info);
      }

      .stiich-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        border: none;
        cursor: pointer;
        font-weight: 600;
        border-radius: 0.5rem;
        transition: all 150ms;
        font-family: inherit;
      }
      .stiich-btn--primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      .stiich-btn--primary:hover {
        opacity: 0.92;
      }
      .stiich-btn--sm {
        height: 32px;
        padding: 0 0.75rem;
        font-size: 0.78rem;
      }
      .stiich-icon--sm {
        font-size: 1rem;
      }

      .stiich-contacts-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .stiich-contacts-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--ds-bg-sunken);
      }
      .stiich-contacts-card__icon {
        font-size: 1.25rem;
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-contacts-card__title {
        font-weight: 600;
        font-size: 0.8125rem;
        color: var(--ds-text-primary);
      }
      .stiich-btn-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 50%;
        color: var(--ds-primary-dark, var(--ds-primary));
        transition: background 150ms;
      }
      .stiich-btn-icon:hover {
        background: color-mix(in srgb, var(--ds-primary) 8%, transparent);
      }

      .stiich-contact {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
      }
      .stiich-contact__avatar-wrap {
        position: relative;
        flex-shrink: 0;
      }
      .stiich-contact__avatar {
        width: 40px;
        height: 40px;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        color: var(--ds-on-primary);
      }
      .stiich-contact__status {
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--ds-bg-surface);
        background: var(--ds-text-muted);
      }
      .stiich-contact__status--online {
        background: var(--ds-success);
      }
      .stiich-contact__info {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .stiich-contact__name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .stiich-contact__role {
        font-size: 0.7rem;
        color: var(--ds-text-secondary);
      }
      .stiich-contact__actions {
        display: flex;
        gap: 2px;
        flex-shrink: 0;
      }
    `,
  ],
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

  // --- Search + Add pattern ---
  searchTerm = signal<string>("");

  private readonly allItems = [
    { id: 1, name: "Bomba Hidroneumótica", code: "EQ-001", status: "Activo" },
    {
      id: 2,
      name: "Generador de Emergencia",
      code: "EQ-002",
      status: "Activo",
    },
    { id: 3, name: "Elevador Torre A", code: "EQ-003", status: "Activo" },
    { id: 4, name: "Cisterna Principal", code: "EQ-004", status: "Activo" },
  ];

  filteredItems = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return q
      ? this.allItems.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.code.toLowerCase().includes(q),
        )
      : this.allItems;
  });

  onAdd(): void {
    console.log("Agregar nuevo registro");
  }

  // --- Ripple demo ---
  lastRipple = signal<string>("");
  onRippleTap(label: string): void {
    this.lastRipple.set(label);
  }

  // --- Task List data ---
  tasks = signal<Task[]>([
    {
      id: 1,
      title: "Inspección de elevadores",
      priority: "high",
      due: "2026-07-02",
      completed: false,
    },
    {
      id: 2,
      title: "Revisión de bomba hidroneumótica",
      priority: "medium",
      due: "2026-07-05",
      completed: false,
    },
    {
      id: 3,
      title: "Actualizar plan de mantenimiento",
      priority: "low",
      due: "2026-07-10",
      completed: true,
    },
    {
      id: 4,
      title: "Programar prueba de generador",
      priority: "high",
      due: "2026-07-01",
      completed: false,
    },
  ]);

  toggleTask(id: number): void {
    this.tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  // --- Contacts Directory data ---
  contacts = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Senior Software Engineer",
      initials: "AR",
      color: "var(--ds-primary)",
      online: true,
    },
    {
      id: 2,
      name: "Amanda Miller",
      role: "Account Manager",
      initials: "AM",
      color: "var(--ds-primary-dark, var(--ds-primary))",
      online: false,
    },
    {
      id: 3,
      name: "Benjamin Foster",
      role: "Lead Product Designer",
      initials: "BF",
      color: "var(--ds-info)",
      online: true,
    },
    {
      id: 4,
      name: "Catherine Vance",
      role: "Senior Project Manager",
      initials: "CV",
      color: "var(--ds-primary-dark, var(--ds-primary))",
      online: true,
    },
    {
      id: 5,
      name: "Daniel Park",
      role: "CTO",
      initials: "DP",
      color: "var(--ds-info)",
      online: false,
    },
  ];

  onChat(name: string): void {
    console.log("Chat with", name);
  }
  onCall(name: string): void {
    console.log("Call", name);
  }

  constructor() {
    addIcons({
      addOutline,
      callOutline,
      chatbubbleOutline,
      checkmarkCircleOutline,
      closeOutline,
      createOutline,
      flagOutline,
      searchOutline,
      starOutline,
      timeOutline,
      trashOutline,
      warningOutline,
    });
  }
}

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  due: string;
  completed: boolean;
}

