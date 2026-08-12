import { ChangeDetectionStrategy, Component } from "@angular/core";
import { addIcons } from "ionicons";
import {
  briefcaseOutline,
  calculatorOutline,
  chatbubblesOutline,
  constructOutline,
  peopleOutline,
  personAddOutline,
  settingsOutline,
} from "ionicons/icons";
import { AgendaSemanalCard } from "src/app/core/layout/direccion-view/components/agenda-semanal-card/agenda-semanal-card";
import { ContratosCard } from "src/app/core/layout/direccion-view/components/contratos-card/contratos-card";
import { PersonalAusenteCard } from "src/app/core/layout/direccion-view/components/personal-ausente-card/personal-ausente-card";
import { ReclutamientoCard } from "src/app/core/layout/direccion-view/components/reclutamiento-card/reclutamiento-card";
import { TareasLegalCard } from "src/app/core/layout/direccion-view/components/tareas-legal-card/tareas-legal-card";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

export interface AreaDireccion {
  key: string;
  label: string;
  iconPi: AppIconName;
  color: string;
  metricas: string[];
}

@Component({
  selector: "app-home-direccion",
  imports: [
    AppIcon,
    AgendaSemanalCard,
    ReclutamientoCard,
    PersonalAusenteCard,
    ContratosCard,
    TareasLegalCard,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./home-direccion.html",
})
export class HomeDireccion {
  readonly areas: AreaDireccion[] = [
    {
      key: "juntas-comite",
      label: "Juntas con Comite",
      iconPi: "material-symbols-light:forum",
      color: "#0ea5e9",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "contabilidad",
      label: "Contabilidad",
      iconPi: "material-symbols-light:calculate",
      color: "#22c55e",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "legal",
      label: "Legal",
      iconPi: "material-symbols-light:work",
      color: "#3b82f6",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "recursos-humanos",
      label: "Recursos Humanos",
      iconPi: "material-symbols-light:group",
      color: "#f97316",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "reclutamiento",
      label: "Reclutamiento",
      iconPi: "material-symbols-light:person-add",
      color: "#a855f7",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "operaciones",
      label: "Operaciones",
      iconPi: "material-symbols-light:settings",
      color: "#ef4444",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "mantenimiento",
      label: "Mantenimiento",
      iconPi: "material-symbols-light:build",
      color: "#8b5cf6",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
  ];

  constructor() {
    addIcons({
      calculatorOutline,
      briefcaseOutline,
      peopleOutline,
      personAddOutline,
      settingsOutline,
      constructOutline,
      chatbubblesOutline,
    });
  }
}
