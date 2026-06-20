import { CommonModule } from "@angular/common";
import { Component, input, ViewEncapsulation } from "@angular/core";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

// --- PrimeNG Modules ---
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { TextareaModule } from "primeng/textarea";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { FloatLabelModule } from "primeng/floatlabel";
import { ToastModule } from "primeng/toast";
import { MessageModule } from "primeng/message";
import { PopoverModule } from "primeng/popover";

// --- Grandchild Components ---
import { WebButtons } from "./components/web-buttons/web-buttons";
import { WebInputs } from "./components/web-inputs/web-inputs";
import { WebAlerts } from "./components/web-alerts/web-alerts";
import { WebBadges } from "./components/web-badges/web-badges";
import { WebCards } from "./components/web-cards/web-cards";
import { WebTables } from "./components/web-tables/web-tables";
import { WebForms } from "./components/web-forms/web-forms";
import { WebErpPatterns } from "./components/web-erp-patterns/web-erp-patterns";
import { WebAiPatterns } from "./components/web-ai-patterns/web-ai-patterns";
import { EStatus } from "src/app/core/components/status-badge/status-badge";

@Component({
  selector: "app-catalog-web",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TooltipModule,
    TableModule,
    TagModule,
    SelectButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    CheckboxModule,
    MultiSelectModule,
    TextareaModule,
    InputIconModule,
    IconFieldModule,
    FloatLabelModule,
    ToastModule,
    MessageModule,
    PopoverModule,
    WebButtons,
    WebInputs,
    WebAlerts,
    WebBadges,
    WebCards,
    WebTables,
    WebForms,
    WebErpPatterns,
    WebAiPatterns,
  ],
  templateUrl: "./catalog-web.html",
  styleUrls: ["./catalog-web.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogWeb {
  mobilePreview = input<boolean>(false);
  isDarkMode = input<boolean>(false);
  filterForm = input<FormGroup>();
  tableData = input<any[]>([]);
  deptoOptions = input<any[]>([]);
  statusOptions = input<any[]>([]);
  EStatus = EStatus;
}
