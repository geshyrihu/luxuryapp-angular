import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IWorkPositionHours } from "../models/work-position.model";

@Component({
  selector: "app-work-position-hours",
  templateUrl: "./work-position-hours.html",
  imports: [CardModule],
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
