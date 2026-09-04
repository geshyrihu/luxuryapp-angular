import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { LxCard } from "@ui/adaptive/card/card";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IWorkPositionHours } from "./interfaces/work-position.model";

@Component({
  selector: "app-work-position-hours",
  templateUrl: "./work-position-hours.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, AppIcon],
})
export class WorkPositionHours implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  readonly apiS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  // --- SIGNALS ---
  data = signal<IWorkPositionHours | null>(null);
  readOnly = signal(false);

  dias = [
    { n: "Lunes", dw: 1 },
    { n: "Martes", dw: 2 },
    { n: "Miércoles", dw: 3 },
    { n: "Jueves", dw: 4 },
    { n: "Viernes", dw: 5 },
    { n: "Sábado", dw: 6 },
    { n: "Domingo", dw: 0 },
  ];

  ngOnInit() {
    const id = this.config.data?.id;
    this.readOnly.set(this.config.data?.readOnly === true);
    if (id) {
      this.onLoadData(id);
    }
  }

  async onLoadData(id: string) {
    const result = await this.apiS.onGetItem<IWorkPositionHours>(
      `work-positions/hours/${id}`,
    );
    this.data.set(result);
  }
}
