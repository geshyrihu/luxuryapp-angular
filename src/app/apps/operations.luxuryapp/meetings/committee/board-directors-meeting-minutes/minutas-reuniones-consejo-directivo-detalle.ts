import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  peopleOutline,
  personAddOutline,
  personOutline,
  warningOutline,
} from "ionicons/icons";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { LxTag } from "@ui/adaptive/tag/tag";

@Component({
  selector: "app-minutas-reuniones-consejo-directivo-detalle",
  imports: [LxTag, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./minutas-reuniones-consejo-directivo-detalle.html",
})
export class MinutasReunionesConsejoDirectivoDetalle implements OnInit {
  constructor() {
    addIcons({
      calendarOutline,
      personOutline,
      peopleOutline,
      personAddOutline,
      warningOutline,
    });
  }

  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  loading = signal(true);

  data = signal<any>(null);

  ngOnInit(): void {
    const meetingMinuteId = this.rutaActiva.snapshot.params.id;
    this.onLoadData(meetingMinuteId);
  }

  onLoadData(meetingMinuteId: string) {
    this.loading.set(true);
    // Usamos el endpoint específico para las minutas que creamos en el backend
    const urlApi = `BoardDirectors/meeting-minutes-detail/${meetingMinuteId}`;

    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data.set(result);
      this.loading.set(false);
    });
  }

  /**
   * Devuelve una clase de Bootstrap para el badge de estado.
   * @param status El estado del asunto/detalle.
   * @returns La clase CSS correspondiente.
   */
  getStatusBadgeColor(status: string): string {
    switch (status.toLowerCase().trim()) {
      case "pendiente":
        return "warning";
      case "en progreso":
      case "proceso":
      case "doing":
        return "primary";
      case "concluido":
      case "completado":
      case "hecho":
        return "success";
      case "cancelado":
      case "no autorizado":
        return "danger";
      default:
        return "medium";
    }
  }

  getStatusClass(status: string): string {
    if (!status) return "";

    switch (status.toLowerCase().trim()) {
      case "pendiente":
        return "status-pendiente";

      case "en progreso":
      case "proceso": // por si en los datos llega como óprocesoó
      case "doing":
        return "status-en-progreso";

      case "concluido":
      case "completado":
      case "hecho":
        return "status-completado";

      case "cancelado":
      case "no autorizado":
        return "status-cancelado";

      default:
        return "status-pendiente"; // o una neutral
    }
  }
}
