import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DrawerModule } from "primeng/drawer";
import { StepperModule } from "primeng/stepper";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";

@Component({
  selector: "app-web-erp-patterns",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    WebButtonLabel,
    DrawerModule,
    StepperModule,
    DividerModule,
    AppIcon,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule
  ],
  templateUrl: "./web-erp-patterns.html",
  encapsulation: ViewEncapsulation.None,
})
export class WebErpPatterns {
  filterDrawerVisible = false;
  
  options = [
    { label: "Ventas", value: 1 },
    { label: "Finanzas", value: 2 },
  ];
}
