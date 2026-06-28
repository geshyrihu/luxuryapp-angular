import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { lockClosedOutline, lockOpenOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-active-desactive",
  imports: [CommonModule, TooltipModule, AppIcon, IonButton, IonIcon],
  styles: [`.btn-state-on{color:var(--ds-success)}.btn-state-off{color:var(--ds-danger)}`],
  template: `
    @if (platform.isMobile()) {
      <ion-button
        (click)="toggleState()"
        expand="block"
        [disabled]="disabled()"
        [style]="mobileStyle()"
      >
        <ion-icon [name]="mobileIcon()" slot="start" />
        {{ dynamicLabel() }}
      </ion-button>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="stateClasses()"
        (click)="toggleState()"
        [pTooltip]="dynamicLabel()"
        [tooltipPosition]="tooltipPosition()"
      >
        <span [class]="dynamicIconShellClass()" aria-hidden="true">
          <app-icon [icon]="dynamicIcon()" />
        </span>
        <span>{{ dynamicLabel() }}</span>
      </button>
    }
  `,
})
export class CustomBtnActiveDesactive extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override severity = input<any>("secondary");
  override fluid = input<boolean>(true);

  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  dynamicLabel = computed(() =>
    this.state() ? this.inactivasLabel() : this.activasLabel(),
  );

  dynamicIcon = computed(() =>
    this.state() ? "mdi:eye-off" : "mdi:eye-outline",
  );

  mobileIcon = computed(() =>
    this.state() ? "lock-closed-outline" : "lock-open-outline",
  );

  mobileStyle = computed(() =>
    this.state()
      ? `--border-radius:8px;--border-color:var(--secondary-400);--color:#64748b;--background:transparent;
         height:42px;font-weight:600;font-size:13px;`
      : `--border-radius:8px;--background:linear-gradient(135deg,var(--primary-400,#6687b3),var(--primary-500,#0b3164));
         --color:#ffffff;--box-shadow:0 4px 14px color-mix(in srgb, var(--primary-600) 35%, transparent);height:48px;font-weight:700;font-size:14px;`,
  );

  dynamicIconShellClass = computed(() =>
    [
      "btn-icon-shell",
      "btn-icon-shell--soft",
      "btn-icon-shell--with-label",
      this.state() ? "bg-white-alpha-20 btn-state-on" : "bg-white-alpha-20 btn-state-off",
    ].join(" "),
  );

  stateClasses = computed(() => {
    const base = "btn no-print w-full ";
    return this.state() ? base + "btn-outline-success" : base + "btn-outline-danger";
  });

  constructor() {
    super();
    addIcons({ lockClosedOutline, lockOpenOutline });
  }

  toggleState(): void {
    this.stateChange.emit(!this.state());
  }
}
