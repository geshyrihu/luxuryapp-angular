import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-web-cards",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
  ],
  template: `
    <p-card header="Card Variants">
      <div class="flex flex-column gap-3">
        <p-card header="Standard Card" subheader="With subtitle">
          <p class="m-0 text-sm">Default PrimeNG card with header, subheader, and content.</p>
        </p-card>

        <p-card header="Shadow Elevated" styleClass="shadow-3">
          <p class="m-0 text-sm">Card with shadow-3 elevation for emphasis.</p>
        </p-card>

        <div class="grid">
          <div class="col-6">
            <p-card header="Bordered" styleClass="border-primary border-2">
              <p class="m-0 text-sm">Card with primary border accent.</p>
            </p-card>
          </div>
          <div class="col-6">
            <p-card header="Interactive" styleClass="transition-all hover:shadow-3 cursor-pointer">
              <p class="m-0 text-sm">Hover for elevation effect.</p>
            </p-card>
          </div>
        </div>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebCards {}
