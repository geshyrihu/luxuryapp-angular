import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/angular/standalone";
import { PaginatorBase } from "@ui/base/paginator.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

@Component({
  selector: "ili-paginator",

  imports: [IonButton, IonSelect, IonSelectOption, AppIconMobile],
  template: `
    <div class="ili-paginator">
      <div class="ili-paginator-info">
        {{ firstItem() }}–{{ lastItem() }} de {{ totalRecords() }}
      </div>

      <div class="ili-paginator-controls">
        @if (showFirstLast()) {
          <ion-button
            fill="clear"
            size="small"
            [disabled]="isFirstPage()"
            (click)="onPageChange(0)"
          >
            <ili-icon icon="material-symbols-light:first-page" />
          </ion-button>
        }

        <ion-button
          fill="clear"
          size="small"
          [disabled]="isFirstPage()"
          (click)="onPageChange(page() - 1)"
        >
          <ili-icon icon="material-symbols-light:chevron-left" />
        </ion-button>

        <span class="ili-paginator-current"
          >{{ page() + 1 }} / {{ totalPages() }}</span
        >

        <ion-button
          fill="clear"
          size="small"
          [disabled]="isLastPage()"
          (click)="onPageChange(page() + 1)"
        >
          <ili-icon icon="material-symbols-light:chevron-right" />
        </ion-button>

        @if (showFirstLast()) {
          <ion-button
            fill="clear"
            size="small"
            [disabled]="isLastPage()"
            (click)="onPageChange(totalPages() - 1)"
          >
            <ili-icon icon="material-symbols-light:last-page" />
          </ion-button>
        }
      </div>

      @if (rowsPerPageOptions().length > 0) {
        <div class="ili-paginator-rows">
          <ion-select
            [value]="rows()"
            (ionChange)="onRowsChange($event.detail.value)"
            interface="popover"
            class="ili-paginator-select"
          >
            @for (opt of rowsPerPageOptions(); track opt) {
              <ion-select-option [value]="opt">{{ opt }}</ion-select-option>
            }
          </ion-select>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem 0.5rem;
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
      }
      .ili-paginator-info {
        white-space: nowrap;
      }
      .ili-paginator-controls {
        display: flex;
        align-items: center;
        gap: 0.125rem;
      }
      .ili-paginator-current {
        min-width: 3rem;
        text-align: center;
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .ili-paginator-rows {
        display: flex;
        align-items: center;
      }
      .ili-paginator-select {
        --padding-start: 0.5rem;
        --padding-end: 0.5rem;
        font-size: 0.8125rem;
        min-width: 4rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobilePaginator extends PaginatorBase {}
