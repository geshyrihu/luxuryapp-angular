import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { LxCard } from "@ui/adaptive/card/card";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
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

  semanas = signal<number[]>([1]);

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
    
    if (result && result.diasDeTrabajo) {
      const max = Math.max(1, ...result.diasDeTrabajo.map(d => d.numeroSemanaCiclo || 1));
      this.semanas.set(Array.from({ length: max }, (_, i) => i + 1));
    }
  }

  getDayData(dayOfWeek: number, week: number) {
    return this.data()?.diasDeTrabajo?.find(d => d.diaSemana === dayOfWeek && (d.numeroSemanaCiclo || 1) === week);
  }
  
  getWeeklyHours(week: number): string {
    let totalMinutes = 0;
    const days = this.data()?.diasDeTrabajo?.filter(d => (d.numeroSemanaCiclo || 1) === week && !d.esDescanso) || [];
    
    for (const d of days) {
      if (d.horaEntrada && d.horaSalida) {
        const [hE, mE] = d.horaEntrada.split(':').map(Number);
        const [hS, mS] = d.horaSalida.split(':').map(Number);
        let minsE = hE * 60 + (mE || 0);
        let minsS = hS * 60 + (mS || 0);
        if (minsS < minsE) minsS += 24 * 60; // cruce de medianoche
        totalMinutes += (minsS - minsE);
      }
    }
    
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h} hrs${m > 0 ? ' ' + m + 'm' : ''}`;
  }
  
  close(): void {
    this.ref.close();
  }
}
