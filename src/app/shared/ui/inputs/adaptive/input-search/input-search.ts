import { Component, inject, input, output, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { IonInputSearch } from "../../mobile/ion-input-search";
import { WebInputSearch } from "../../web/input-search/input-search";

@Component({
  selector: "custom-search-input-signal",
  standalone: true,
  imports: [WebInputSearch, IonInputSearch],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-search
        [placeholder]="placeholder()"
        [debounce]="debounce()"
        (searchChange)="searchChange.emit($event)"
      />
    } @else {
      <web-input-search
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (searchChange)="searchChange.emit($event)"
      />
    }
  `,
})
export class InputSearch {
  protected platform = inject(PlatformService);

  placeholder = input<string>("Buscar aquí...");
  disabled = input<boolean>(false);
  debounce = input<number>(300);
  searchChange = output<string>();
}
