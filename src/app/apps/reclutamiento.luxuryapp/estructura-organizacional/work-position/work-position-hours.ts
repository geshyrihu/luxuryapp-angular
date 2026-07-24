import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { LxCard } from "@ui/adaptive/card/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IWorkPositionHours } from './interfaces/work-position.model';

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
