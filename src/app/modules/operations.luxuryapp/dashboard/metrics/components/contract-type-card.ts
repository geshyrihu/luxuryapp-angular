import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon as AppIconComponent } from "@ui/shared/app-icon/app-icon";
import { AppIcon, AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import { ContractsExpiringTypeItemDTO } from "../interfaces/contracts-expiring.dto";

@Component({
  selector: "app-contract-type-card",
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="card h-100" style="background-color: var(--ds-bg-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-sm);">
      <div class="card-body">
        <h5 class="card-title d-flex align-items-center mb-3" style="color: var(--ds-text-primary);">
          <app-icon [icon]="getIconName()" class="me-2" [style.color]="getValueColor()"></app-icon>
          {{ item().typeName }}
        </h5>
        
        <div class="mb-4">
          <div class="d-flex flex-column">
            <span style="font-size: var(--ds-font-size-help); color: var(--ds-text-secondary);">vencen en ≤45 días</span>
            <span style="font-size: var(--ds-font-size-metric); font-weight: bold;" [style.color]="getValueColor()">
              {{ item().total }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractTypeCardComponent {
  item = input.required<ContractsExpiringTypeItemDTO>();

  getIconName(): AppIconName {
    // 1: Fijo, 2: Polizas, 3: Remodelaciones, 4: BuildingInsurancePolicy
    switch (this.item().typeId) {
      case 1:
        return AppIcon.FileDocument;
      case 2:
        return AppIcon.ShieldCheck;
      case 3:
        return AppIcon.Tools;
      case 4:
        return AppIcon.ShieldCheck;
      default:
        return AppIcon.FileDocument;
    }
  }

  getValueColor(): string {
    return this.item().total > 0 ? "var(--ds-danger)" : "var(--ds-text-muted)";
  }
}
