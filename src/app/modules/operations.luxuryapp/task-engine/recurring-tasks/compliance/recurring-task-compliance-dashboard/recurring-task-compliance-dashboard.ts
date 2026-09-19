import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  ComplianceDashboardDTO,
  ComplianceGroupDTO,
} from "@core/interfaces/recurring-tasks/recurring-task-compliance.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-recurring-task-compliance-dashboard",
  templateUrl: "./recurring-task-compliance-dashboard.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxMessage,
    LxTag,
    DataViewMobile,
    MobileListItem,
    TableCaption,
    TableEmptyMessage,
    AppTable,
    AppIcon,
  ],
})
export class RecurringTaskComplianceDashboard implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  groups = signal<ComplianceGroupDTO[]>([]);
  totalGroupsWithoutTemplates = signal(0);
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    void this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);

    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      this.groups.set([]);
      this.totalGroupsWithoutTemplates.set(0);
      this.loading.set(false);
      return;
    }

    try {
      const response = await this.apiResponseS.onGetList<ComplianceDashboardDTO>(
        Endpoints.RecurringTaskCompliance.dashboard(customerId),
      );

      this.groups.set(response?.groups ?? []);
      this.totalGroupsWithoutTemplates.set(
        response?.totalGroupsWithoutTemplates ?? 0,
      );
    } finally {
      this.loading.set(false);
    }
  }

  activeTemplateLabel(group: ComplianceGroupDTO): string {
    return group.hasActiveTemplates ? "Sí" : "No";
  }

  activeTemplateSeverity(group: ComplianceGroupDTO): "success" | "warn" {
    return group.hasActiveTemplates ? "success" : "warn";
  }

  criticalAttachmentPercentage(group: ComplianceGroupDTO): string {
    if (group.criticalClosedTotal === 0) return "N/A";

    return `${Math.round(
      (group.criticalClosedWithAttachmentCount / group.criticalClosedTotal) *
        100,
    )}%`;
  }
}

