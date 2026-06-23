import { Component, inject, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonSearchbar } from "@ionic/angular/standalone";
import { PlatformService } from "src/app/core/services/platform.service";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { AppIcon } from "../../app-icon/app-icon.component";

@Component({
  selector: "custom-search-input-signal",
  imports: [IconFieldModule, InputIconModule, InputTextModule, AppIcon, IonSearchbar, ReactiveFormsModule],
  template: `
    @if (platform.isMobile()) {
      <ion-searchbar
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        animated="true"
        [debounce]="debounce()"
        (ionInput)="onIonSearch($event)"
        (ionClear)="searchChange.emit('')"
      />
    } @else {
      <p-iconfield iconPosition="left" fluid>
        <p-inputicon>
          <app-icon icon="mdi:magnify" />
        </p-inputicon>
        <input
          pInputText
          type="text"
          (input)="onInput($event)"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          fluid
          class="text-xs"
        />
      </p-iconfield>
    }
  `,
})
export class CustomSearchInput {
  protected readonly platform = inject(PlatformService);

  placeholder = input<string>("Buscar aquí...");
  disabled = input<boolean>(false);
  debounce = input<number>(300);

  searchChange = output<string>();

  onInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  onIonSearch(event: any): void {
    this.searchChange.emit(event.detail.value ?? "");
  }
}
