import { Component, ViewEncapsulation, output } from "@angular/core";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/angular/standalone";
import { CommonModule } from "@angular/common";
import { InfiniteScrollBase } from "@ui/base/infinite-scroll.base";

@Component({
  selector: "ili-infinite-scroll",
  standalone: true,
  imports: [CommonModule, IonInfiniteScroll, IonInfiniteScrollContent],
  template: `
    <ion-infinite-scroll
      [disabled]="disabled()"
      [threshold]="threshold()"
      (ionInfinite)="onScroll($event)"
    >
      <ion-infinite-scroll-content
        loadingSpinner="bubbles"
        loadingText="Cargando más registros..."
      />
    </ion-infinite-scroll>
  `,
  styles: [`
    :host { display: contents; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileInfiniteScroll extends InfiniteScrollBase {
  complete = output<void>();

  onScroll(event: CustomEvent): void {
    this.loadMore.emit();
    setTimeout(() => {
      (event.target as HTMLIonInfiniteScrollElement)?.complete();
    }, 500);
  }
}
