import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
} from "@ionic/angular/standalone";
import { TableBase } from "@ui/base/table.base";
import { MobileEmptyState } from "@ui/mobile/empty-state/empty-state";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-table",

  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonProgressBar,
    AppIcon,
    MobileEmptyState,
  ],
  template: `
    <div class="ili-table-root">
      @if (loading()) {
        <ion-progress-bar type="indeterminate" />
      }

      @if (data().length === 0 && !loading()) {
        <ili-empty-state
          icon="mdi:table-off"
          [title]="'Sin registros'"
          [message]="emptyMessage()"
        />
      }

      <div class="ili-table-cards">
        @for (row of data(); track row[dataKey()] || $index) {
          <ion-card class="ili-table-card" (click)="onRowClick(row)">
            <ion-card-header class="ili-table-card-header">
              @for (col of columns(); track col.field) {
                @if ($first) {
                  <ion-card-title class="ili-table-card-title">
                    @if (col.icon) {
                      <app-icon [icon]="col.icon" class="ili-table-card-icon" />
                    }
                    {{ row[col.field] }}
                  </ion-card-title>
                }
              }
            </ion-card-header>

            <ion-card-content class="ili-table-card-content">
              @for (col of columns(); track col.field) {
                @if (!$first) {
                  <div class="ili-table-field">
                    <span class="ili-table-field-label">{{ col.header }}</span>
                    <span class="ili-table-field-value">{{
                      row[col.field]
                    }}</span>
                  </div>
                }
              }
            </ion-card-content>
          </ion-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .ili-table-root {
        width: 100%;
      }
      .ili-table-cards {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
      }
      .ili-table-card {
        margin: 0;
        border-radius: var(--ds-radius-lg, 12px);
        box-shadow: var(--ds-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
      }
      .ili-table-card-header {
        padding: 0.75rem 1rem 0.25rem;
      }
      .ili-table-card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .ili-table-card-icon {
        font-size: 1.25rem;
      }
      .ili-table-card-content {
        padding: 0.25rem 1rem 0.75rem;
      }
      .ili-table-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.35rem 0;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-table-field:last-child {
        border-bottom: none;
      }
      .ili-table-field-label {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary, #64748b);
      }
      .ili-table-field-value {
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        font-weight: 500;
        text-align: right;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTable extends TableBase {
  onRowClick(row: any): void {
    this.rowClick.emit(row);
    if (this.selectionMode() === "single") {
      this.selection.set(row);
      this.selectionChange.emit(row);
    }
  }
}
