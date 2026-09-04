import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { IWorkPositionHours } from "./interfaces/work-position.model";

@Component({
  selector: "app-work-position-details",
  templateUrl: "./work-position-details.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, LxTag, WebButtonLabel],
})
export class WorkPositionDetails implements OnInit {
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private apiS = inject(ApiResponseService);

  folio = signal<string>("");
  applicationRoleName = signal<string>("");
  departamentLabel = signal<string>("");

  general = signal<any>(null);
  description = signal<any>(null);
  hours = signal<IWorkPositionHours | null>(null);

  activeTab = signal<"description" | "general">("description");

  dias = [
    { n: "Lunes", dw: 1 },
    { n: "Martes", dw: 2 },
    { n: "Miércoles", dw: 3 },
    { n: "Jueves", dw: 4 },
    { n: "Viernes", dw: 5 },
    { n: "Sábado", dw: 6 },
    { n: "Domingo", dw: 0 },
  ];

  ngOnInit(): void {
    const data = this.config.data ?? {};
    this.folio.set(data.folio ?? "");
    this.applicationRoleName.set(data.applicationRoleName ?? "");
    this.departamentLabel.set(data.departamentLabel ?? "");
    const id = data.id;
    if (id) this.onLoadData(id, data.jobDescriptionId ?? null);
  }

  async onLoadData(id: string, jobDescriptionId: string | null): Promise<void> {
    const [general, hours] = await Promise.all([
      this.apiS.onGetItem<any>(`work-positions/for-edit/${id}`),
      this.apiS
        .onGetItem<IWorkPositionHours>(`work-positions/hours/${id}`)
        .catch(() => null),
    ]);
    this.general.set(general);
    this.hours.set(hours);

    if (jobDescriptionId) {
      const desc = await this.apiS.onGetItem<any>(
        `job-descriptions/${jobDescriptionId}`,
      );
      this.description.set(desc);
    }
  }

  close(): void {
    this.ref.close();
  }
}
