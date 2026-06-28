import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../buttons/base/base-button";

@Component({
  selector: "custom-button-item",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-item button detail="false" lines="none"
        [disabled]="disabled()" [class]="customClass()"
        (click)="clicked.emit($event)"
        style="--background:#f8fafc;--background-activated:#f1f5f9;--border-radius:8px;
               --padding-start:10px;--inner-padding-end:14px;--min-height:44px;
               margin-bottom:4px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
      >
        @if (emoji() || resolvedIcon()) {
          <div slot="start"
            style="width:32px;height:32px;border-radius:8px;background:#e2e8f0;
                   display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
            @if (emoji()) {
              <span style="font-size:17px;">{{ emoji() }}</span>
            } @else {
              <ion-icon [name]="ionicIcon()" style="font-size:17px;color:#475569;" />
            }
          </div>
        }
        <ion-label style="font-weight:600;font-size:13px;color:var(--secondary-800);">
          {{ label() || "Accion" }}
        </ion-label>
      </ion-item>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="clicked.emit($event)"
        [pTooltip]="getTooltip()"
        [tooltipPosition]="tooltipPosition()"
      >
        @if (resolvedIcon()) {
          <span [class]="iconShellClasses(showLabelOnDesktop() && !!label())" aria-hidden="true">
            <app-icon [icon]="resolvedIcon()" />
          </span>
        }
        @if (showLabelOnDesktop() && label()) {
          <span>{{ label() }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonItem extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(true);
  override size = input<any>("small");
  override showLabelOnDesktop = input<boolean>(false);

  ionicIcon = input<string>("");

  getTooltip = computed(
    () => this.tooltip() || this.ngbTooltip() || this.label() || "",
  );
}


