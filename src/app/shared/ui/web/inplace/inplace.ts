import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InplaceModule } from "primeng/inplace";
import { InplaceBase } from "@ui/base/inplace.base";

@Component({
  selector: "app-inplace",
  standalone: true,
  imports: [CommonModule, InplaceModule],
  template: `
    <p-inplace
      [active]="active()"
      (activeChange)="active.set($event)"
      [closable]="closable()"
    >
      <p-inplace-display>
        <ng-content select="[inplaceDisplay]" />
      </p-inplace-display>
      <p-inplace-content>
        <ng-content select="[inplaceContent]" />
      </p-inplace-content>
    </p-inplace>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppInplace extends InplaceBase {}
