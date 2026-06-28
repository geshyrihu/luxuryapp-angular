import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../buttons/base/base-button";

@Component({
  selector: "custom-button",
  imports: [CommonModule, TooltipModule, AppIcon, IonButton, IonIcon, IonSpinner],
  template: `
    @if (platform.isMobile()) {
      <ion-button
        [type]="type()"
        [disabled]="disabled()"
        [fill]="mobileFill()"
        [expand]="fluid() ? 'block' : null"
        [color]="mobileColor()"
        [size]="mobileSize()"
        (click)="clicked.emit($event)"
      >
        @if (loading()) {
          <ion-spinner name="crescent" slot="start" style="width:18px;height:18px;" />
        } @else if (ionicIcon()) {
          <ion-icon [name]="ionicIcon()" slot="start" />
        }
        @if (label()) { {{ label() }} }
      </ion-button>
    } @else {
      <div [class.field]="!noMargin()" [class.mb-0]="noMargin()">
        <button
          [type]="type()"
          [disabled]="disabled()"
          [class]="'inline-flex align-items-center gap-1 ' + btnClasses() + ' ' + customClass()"
          [ngClass]="customNgClass()"
          (click)="clicked.emit($event)"
          [pTooltip]="tooltip() || ngbTooltip() || label()"
          [tooltipPosition]="tooltipPosition()"
        >
          @if (loading()) {
            <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
              <app-icon icon="mdi:loading" class="ds-animate-spin" />
            </span>
          } @else if (resolvedIcon()) {
            <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
              <app-icon [icon]="resolvedIcon()" />
            </span>
          }
          @if (showLabelOnDesktop() && label()) {
            <span>{{ label() }}</span>
          }
        </button>
      </div>
    }
  `,
  styles: [`.field { margin-bottom: 1rem; }`],
})
export class CustomButton extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override showLabelOnDesktop = input<boolean>(true);
  ionicIcon = input<string>("");

  mobileColor = computed(() => {
    const s = this.severity();
    const map: Record<string, string> = {
      primary: "primary", secondary: "medium", success: "success",
      info: "tertiary", warn: "warning", help: "tertiary",
      danger: "danger", contrast: "dark",
    };
    return map[s ?? "primary"] ?? "primary";
  });

  mobileFill = computed(() => {
    const v = this.variant();
    if (v === "outlined") return "outline";
    if (v === "text") return "clear";
    return "solid";
  });

  mobileSize = computed(() => {
    const s = this.size();
    if (s === "small") return "small";
    if (s === "large") return "large";
    return "default";
  });
}


