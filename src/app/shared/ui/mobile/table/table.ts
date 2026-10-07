import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonProgressBar,
} from "@ionic/angular";
import { TableBase } from "@ui/core/table.base";
import { MobileEmptyState } from "@ui/mobile/empty-state/empty-state";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-table-mobile",

  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonProgressBar,
    AppIconMobile,
    MobileEmptyState],
  template: `
    <div class="lux-table-mobile-root">
      @if (loading()) {
        <ion-progress-bar type="indeterminate" />
      }

      @if (data().length === 0 && !loading()) {
        <lux-empty-state-mobile
          icon="material-symbols-light:table-view"
          [title]="'Sin registros'"
          [message]="emptyMessage()"
        />
      }

      <div class="lux-table-mobile-cards">
        @for (row of data(); track row[dataKey()] || $index) {
          <ion-card class="lux-table-mobile-card" (click)="onRowClick(row)">
            <ion-card-header class="lux-table-mobile-card-header">
              @for (col of columns(); track col.field) {
                @if ($first) {
                  <ion-card-title class="lux-table-mobile-card-title">
                    @if (col.icon) {
                      <lux-icon-mobile [icon]="col.icon" class="lux-table-mobile-card-icon" />
                    }
                    {{ row[col.field] }}
                  </ion-card-title>
                }
              }
            </ion-card-header>

            <ion-card-content class="lux-table-mobile-card-content">
              @for (col of columns(); track col.field) {
                @if (!$first) {
                  <div class="lux-table-mobile-field">
                    <span class="lux-table-mobile-field-label">{{ col.header }}</span>
                    <span class="lux-table-mobile-field-value">{{
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
      .lux-table-mobile-root {
        width: 100%;
      }
      .lux-table-mobile-cards {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
      }
      .lux-table-mobile-card {
        margin: 0;
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-shadow-sm);
      }
      .lux-table-mobile-card-header {
        padding: 0.75rem 1rem 0.25rem;
      }
      .lux-table-mobile-card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .lux-table-mobile-card-icon {
        font-size: 1.25rem;
      }
      .lux-table-mobile-card-content {
        padding: 0.25rem 1rem 0.75rem;
      }
      .lux-table-mobile-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.35rem 0;
        border-bottom: 1px solid var(--ds-border);
      }
      .lux-table-mobile-field:last-child {
        border-bottom: none;
      }
      .lux-table-mobile-field-label {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
      }
      .lux-table-mobile-field-value {
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        font-weight: 500;
        text-align: right;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTable extends TableBase {
  onRowClick(row: any): void {
    this.rowClick.emit(row);
    if (this.selectionMode() === "single") {
      this.selection.set(row);
    }
  }
}

