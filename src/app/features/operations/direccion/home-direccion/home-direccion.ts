import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AgendaSemanalCard } from "src/app/layout/direccion-view/components/agenda-semanal-card/agenda-semanal-card";
import { ReclutamientoCard } from "src/app/layout/direccion-view/components/reclutamiento-card/reclutamiento-card";
import { PersonalAusenteCard } from "src/app/layout/direccion-view/components/personal-ausente-card/personal-ausente-card";
import { ContratosCard } from "src/app/layout/direccion-view/components/contratos-card/contratos-card";
import { TareasLegalCard } from "src/app/layout/direccion-view/components/tareas-legal-card/tareas-legal-card";
import {
  } from "@ionic/angular/standalone";
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

export interface AreaDireccion {
  key: string;
  label: string;
  iconPi: string;
  iconIon: string;
  color: string;
  metricas: string[];
}

@Component({
  selector: "app-home-direccion",
  imports: [
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
      iconPi: "mdi:comment-multiple",
      iconIon: "chatbubbles-outline",
      color: "#0ea5e9",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "contabilidad",
      label: "Contabilidad",
      iconPi: "mdi:calculator",
      iconIon: "calculator-outline",
      color: "#22c55e",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "legal",
      label: "Legal",
      iconPi: "mdi:briefcase",
      iconIon: "briefcase-outline",
      color: "#3b82f6",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "recursos-humanos",
      label: "Recursos Humanos",
      iconPi: "mdi:account-group",
      iconIon: "people-outline",
      color: "#f97316",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "reclutamiento",
      label: "Reclutamiento",
      iconPi: "mdi:account-plus",
      iconIon: "person-add-outline",
      color: "#a855f7",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "operaciones",
      label: "Operaciones",
      iconPi: "mdi:cog",
      iconIon: "settings-outline",
      color: "#ef4444",
      metricas: ["Pendiente 1", "Pendiente 2", "Pendiente 3"],
    },
    {
      key: "mantenimiento",
      label: "Mantenimiento",
      iconPi: "mdi:wrench",
      iconIon: "construct-outline",
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
