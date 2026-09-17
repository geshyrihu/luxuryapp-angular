import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SplitButtonBase } from "@ui/base/split-button.base";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-split-button",

  imports: [NgbDropdownModule, AppIcon],
  template: `
    <div class="btn-group" ngbDropdown [class]="styleClass()">
      <button type="button" class="btn" [class]="'btn-' + (severity() || 'primary')" [disabled]="disabled()" (click)="onClick.emit($event)">
        @if (icon()) {
          <app-icon [icon]="icon()" class="me-1" />
        }
        {{ label() }}
      </button>
      <button type="button" class="btn dropdown-toggle dropdown-toggle-split" [class]="'btn-' + (severity() || 'primary')" ngbDropdownToggle [disabled]="disabled()">
        <span class="visually-hidden">Más opciones</span>
      </button>
      <div ngbDropdownMenu>
        @for (item of model() ?? []; track $index) {
          <button ngbDropdownItem type="button" [class]="item.class" [disabled]="item.disabled" (click)="item.command && item.command({ originalEvent: $event, item })">
            @if (item.icon) {
              <app-icon [icon]="item.icon" class="me-2" />
            }
            {{ item.label }}
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSplitButton extends SplitButtonBase {}
