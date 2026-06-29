import { CommonModule } from "@angular/common";
import { Component, computed, Directive, inject, input, output } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../shared/buttons/base/base-button";
import { PlatformService } from "src/app/core/services/platform.service";
import { IonButtonActiveDesactive } from "../../mobile/buttons/ion-button-active-desactive";
import { IonButtonAdd } from "../../mobile/buttons/ion-button-add";
import { IonButtonConfirm } from "../../mobile/buttons/ion-button-confirm";
import { IonButtonDelete } from "../../mobile/buttons/ion-button-delete";
import { IonButtonDownload } from "../../mobile/buttons/ion-button-download";
import { IonButtonEdit } from "../../mobile/buttons/ion-button-edit";
import { IonButtonItem } from "../../mobile/buttons/ion-button-item";
import { IonButtonSave } from "../../mobile/buttons/ion-button-save";
import { IonButtonSendEmail } from "../../mobile/buttons/ion-button-send-email";
import { IonButtonTracking } from "../../mobile/buttons/ion-button-tracking";
import { IonButtonViewPdf } from "../../mobile/buttons/ion-button-view-pdf";

@Directive()
abstract class BaseWebPlatformButton extends BaseButton {
  protected readonly platform = inject(PlatformService);
  fluid = input<boolean>(false);
  showLabelOnDesktop = input<boolean>(true);
  tooltip = input<string>("");
  tooltipPosition = input<"top" | "bottom" | "left" | "right">("top");
  ariaLabel = input<string>("");

  protected isPrimeIcon(icon: string): boolean {
    return icon.startsWith("pi ");
  }
}

@Component({
  selector: "custom-button",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButton],
  template: `
    @if (platform.isMobile()) {
      <ion-button
        expand="block"
        [type]="type()"
        [disabled]="disabled() || loading()"
        [fill]="outlined() || text() ? 'outline' : 'solid'"
        [color]="mobileColor()"
        (click)="emitClick($event)"
      >
        @if (emoji()) {
          <span>{{ emoji() }}</span>
        } @else if (iconClass()) {
          @if (isPrimeIcon(iconClass())) {
            <i [class]="iconClass()"></i>
          } @else {
            <app-icon [icon]="iconClass()" />
          }
        }
        {{ label() || "Continuar" }}
      </ion-button>
    } @else {
      <button
        [type]="type()"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="emitClick($event)"
      >
        @if (emoji()) {
          <span>{{ emoji() }}</span>
        } @else if (iconClass()) {
          @if (isPrimeIcon(iconClass())) {
            <i [class]="iconClass()"></i>
          } @else {
            <app-icon [icon]="iconClass()" />
          }
        }
        @if (label()) {
          <span>{{ label() }}</span>
        }
      </button>
    }
  `,
})
export class CustomButton extends BaseWebPlatformButton {
  protected readonly mobileColor = computed(() => {
    const severity = this.normalizedSeverity();
    if (severity === "secondary") return "medium";
    if (severity === "danger") return "danger";
    if (severity === "success") return "success";
    if (severity === "warning") return "warning";
    return "primary";
  });
}

@Component({
  selector: "custom-button-add",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonAdd],
  template: `
    @if (platform.isMobile()) {
      <ion-button-add
        [label]="label()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
        (clicked)="emitClick($event)"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="emitClick($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:plus'" />
        <span>{{ label() || "Agregar" }}</span>
      </button>
    }
  `,
})
export class CustomButtonAdd extends BaseWebPlatformButton {}

@Component({
  selector: "custom-button-edit",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonEdit],
  template: `
    @if (platform.isMobile()) {
      <ion-button-edit
        [label]="label()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
        (clicked)="emitClick($event)"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="emitClick($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:pencil-outline'" />
        <span>{{ label() || "Editar" }}</span>
      </button>
    }
  `,
})
export class CustomButtonEdit extends BaseWebPlatformButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("info");
}

@Component({
  selector: "custom-button-delete",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonDelete],
  template: `
    @if (platform.isMobile()) {
      <ion-button-delete
        [label]="label()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
        (confirmed)="confirmed.emit()"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="confirmDelete($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:delete-outline'" />
        <span>{{ label() || "Eliminar" }}</span>
      </button>
    }
  `,
})
export class CustomButtonDelete extends BaseWebPlatformButton {
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("danger");

  protected confirmDelete(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

@Component({
  selector: "custom-button-confirm",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonConfirm],
  template: `
    @if (platform.isMobile()) {
      <ion-button-confirm
        [label]="label()"
        [disabled]="disabled()"
        [emoji]="emoji()"
        [styleClass]="customClass()"
        (confirmed)="confirmed.emit()"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="confirmAction($event)"
      >
        @if (emoji()) {
          <span>{{ emoji() }}</span>
        } @else {
          <app-icon [icon]="iconClass() || 'mdi:check-circle-outline'" />
        }
        <span>{{ label() || "Confirmar" }}</span>
      </button>
    }
  `,
})
export class CustomButtonConfirm extends BaseWebPlatformButton {
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("success");

  protected confirmAction(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.swalText())) {
      this.confirmed.emit();
    }
  }
}

@Component({
  selector: "custom-button-save",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonSave],
  template: `
    @if (platform.isMobile()) {
      <ion-button-save
        [label]="finalLabel()"
        [propertyId]="propertyId()"
        [disabled]="disabled()"
        [submitting]="submitting()"
        (clicked)="emitClick($event)"
      />
    } @else {
      <button
        [type]="type()"
        [class]="buttonClasses()"
        [disabled]="disabled() || submitting()"
        (click)="emitClick($event)"
      >
        <app-icon [icon]="propertyId() ? 'mdi:content-save-edit-outline' : 'mdi:content-save-outline'" />
        <span>{{ finalLabel() }}</span>
      </button>
    }
  `,
})
export class CustomButtonSave extends BaseWebPlatformButton {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  override severity = input<any>("success");
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("outline");
  override type = input<"button" | "submit" | "reset">("submit");

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}

@Component({
  selector: "custom-button-download",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonDownload],
  template: `
    @if (platform.isMobile()) {
      <ion-button-download
        [disabled]="disabled()"
        (clicked)="emitClick($event)"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="emitClick($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:download'" />
        @if (label()) {
          <span>{{ label() }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonDownload extends BaseWebPlatformButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");
}

@Component({
  selector: "custom-button-send-email",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonSendEmail],
  template: `
    @if (platform.isMobile()) {
      <ion-button-send-email
        [label]="label()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
        (confirmed)="confirmed.emit()"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="confirmSend()"
      >
        <app-icon [icon]="iconClass() || 'mdi:email-outline'" />
        <span>{{ label() || "Enviar correo" }}</span>
      </button>
    }
  `,
})
export class CustomButtonSendEmail extends BaseWebPlatformButton {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("info");

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

@Component({
  selector: "custom-button-view-pdf",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonViewPdf],
  template: `
    @if (platform.isMobile()) {
      <ion-button-view-pdf
        [label]="label()"
        [url]="url()"
        [fileName]="fileName()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="openPdf($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:file-pdf-box'" />
        <span>{{ label() || "Ver archivo" }}</span>
      </button>
    }
  `,
})
export class CustomButtonViewPdf extends BaseWebPlatformButton {
  url = input<string>("");
  fileName = input<string>("");

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");

  protected openPdf(event: Event): void {
    if (this.url()) {
      window.open(this.url(), "_blank");
      return;
    }
    this.emitClick(event);
  }
}

@Component({
  selector: "custom-button-tracking",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonTracking],
  template: `
    @if (platform.isMobile()) {
      <ion-button-tracking
        [disabled]="disabled()"
        [badgeCount]="badgeCount()"
        [ticketId]="ticketId()"
        [trackingTitle]="trackingTitle()"
        (clickTracking)="clickTracking.emit($event)"
      />
    } @else {
      <button
        type="button"
        class="btn btn-ghost-secondary btn--circle btn-sm position-relative"
        [disabled]="disabled() || loading()"
        (click)="onTrackingClick($event)"
      >
        <app-icon [icon]="iconClass() || 'mdi:bell-outline'" />
        @if (badgeCount() && badgeCount()! > 0) {
          <span
            class="absolute top-0 right-0 inline-flex align-items-center justify-content-center text-xs border-circle bg-red-500 text-white"
            style="min-width:1.1rem;height:1.1rem;transform:translate(30%,-30%);"
          >
            {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
          </span>
        }
      </button>
    }
  `,
})
export class CustomButtonTracking extends BaseWebPlatformButton {
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  trackingTitle = input<string>("Seguimiento");

  clickTracking = output<{ ticketId: string | number | null; title: string }>();

  protected onTrackingClick(event: Event): void {
    if (this.disabled() || this.loading()) return;
    this.clickTracking.emit({
      ticketId: this.ticketId(),
      title: this.trackingTitle(),
    });
  }
}

@Component({
  selector: "custom-button-item",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonItem],
  template: `
    @if (platform.isMobile()) {
      <ion-button-item
        [label]="label()"
        [emoji]="emoji()"
        [disabled]="disabled()"
        [styleClass]="customClass()"
        [ionicIcon]="''"
        (clicked)="emitClick($event)"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="emitClick($event)"
      >
        @if (emoji()) {
          <span>{{ emoji() }}</span>
        } @else if (iconClass()) {
          @if (isPrimeIcon(iconClass())) {
            <i [class]="iconClass()"></i>
          } @else {
            <app-icon [icon]="iconClass()" />
          }
        }
        <span>{{ label() || "Accion" }}</span>
      </button>
    }
  `,
})
export class CustomButtonItem extends BaseWebPlatformButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");
}

@Component({
  selector: "custom-button-active-desactive",
  standalone: true,
  imports: [CommonModule, AppIcon, IonButtonActiveDesactive],
  template: `
    @if (platform.isMobile()) {
      <ion-button-active-desactive
        [state]="state()"
        [activasLabel]="activasLabel()"
        [inactivasLabel]="inactivasLabel()"
        [disabled]="disabled()"
        (stateChange)="stateChange.emit($event)"
      />
    } @else {
      <button
        type="button"
        [class]="buttonClasses()"
        [disabled]="disabled() || loading()"
        (click)="toggleState()"
      >
        <app-icon [icon]="state() ? 'mdi:lock-outline' : 'mdi:lock-open-variant-outline'" />
        <span>{{ state() ? inactivasLabel() : activasLabel() }}</span>
      </button>
    }
  `,
})
export class CustomBtnActiveDesactive extends BaseWebPlatformButton {
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("outline");
  override severity = input<any>("secondary");

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
