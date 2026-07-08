import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";

import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IWorkPositionHours } from "../models/work-position.model";
import { LxCard } from "@ui/adaptive/card/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-work-position-hours",
  templateUrl: "./work-position-hours.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, AppIcon],
})
export class WorkPositionHours implements OnInit {
  // --- INYECCIóN DE DEPENDENCIAS ---
  readonly apiS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  // --- SIGNALS ---
  data = signal<IWorkPositionHours | null>(null);

  ngOnInit() {
    const id = this.config.data?.id;
    if (id) {
      this.onLoadData(id);
    }
  }

  async onLoadData(id: string) {
    // Sincronizado con kebab-case
    const result = await this.apiS.onGetItem<IWorkPositionHours>(
      `work-positions/hours/${id}`,
    );
    this.data.set(result);
  }
}
