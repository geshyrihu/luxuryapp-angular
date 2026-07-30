import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from "@angular/core";
import { ConventionCard } from "./components/convention-card/convention-card";
import {
  ConventionRule,
  ConventionsService,
} from "./conventions-viewer.service";
import {
  severityColor,
  severityIcon,
  domainLabel,
  taskTypeLabel,
  type ConventionDomain,
  type ConventionTaskType,
  type SeverityType,
} from "./conventions-viewer.utils";

type TabType = "all" | "by-domain" | "by-task" | "by-severity" | "by-technology";

@Component({
  selector: "app-conventions-viewer",
  imports: [ConventionCard],
  templateUrl: "./conventions-viewer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./conventions-viewer.scss"],
})
export class ConventionsViewer implements OnInit {
  private readonly service = inject(ConventionsService);

  // State
  conventions = signal<ConventionRule[]>([]);
  filteredConventions = signal<ConventionRule[]>([]);
  activeTab = signal<TabType>("all");
  searchQuery = signal("");
  selectedDomain = signal<ConventionDomain | null>(null);
  selectedTaskType = signal<ConventionTaskType | null>(null);
  selectedSeverity = signal<SeverityType | null>(null);
  selectedTechnology = signal<string>("");

  // UI
  domains = signal<ConventionDomain[]>([
    "core",
    "backend",
    "frontend",
    "flutter",
    "ui",
    "styles",
    "catalogs",
    "audit",
    "operations",
  ]);
  taskTypes = signal<ConventionTaskType[]>([
    "implementacion-backend",
    "implementacion-frontend",
    "implementacion-flutter",
    "auditoria",
    "documentacion",
    "operacion-transversal",
  ]);
  severities = signal<SeverityType[]>(["CRÍTICA", "ALTA", "MEDIA", "BAJA"]);
  technologies = signal([
    "Angular",
    ".NET",
    "C#",
    "TypeScript",
    "Flutter",
    "Dart",
    "CSS",
    "Documentación",
  ]);

  ngOnInit(): void {
    this.loadConventions();
  }

  private loadConventions() {
    this.service.getConventions().subscribe((conventions) => {
      this.conventions.set(conventions);
      this.updateFiltered();
    });
  }

  setActiveTab(tab: TabType) {
    this.activeTab.set(tab);
    this.updateFiltered();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    if (query.trim()) {
      this.service.searchConventions(query).subscribe((results) => {
        this.filteredConventions.set(results);
      });
    } else {
      this.updateFiltered();
    }
  }

  filterByDomain(domain: ConventionDomain) {
    this.selectedDomain.set(this.selectedDomain() === domain ? null : domain);
    this.updateFiltered();
  }

  filterByTaskType(taskType: ConventionTaskType) {
    this.selectedTaskType.set(
      this.selectedTaskType() === taskType ? null : taskType,
    );
    this.updateFiltered();
  }

  filterBySeverity(severity: SeverityType) {
    this.selectedSeverity.set(
      this.selectedSeverity() === severity ? null : severity,
    );
    this.updateFiltered();
  }

  filterByTechnology(technology: string) {
    this.selectedTechnology.set(
      this.selectedTechnology() === technology ? "" : technology,
    );
    this.updateFiltered();
  }

  private updateFiltered() {
    let filtered = this.conventions();

    // Por dominio
    if (this.selectedDomain() !== null) {
      filtered = filtered.filter(
        (c) => c.domain === this.selectedDomain(),
      );
    }

    // Por tipo de tarea
    if (this.selectedTaskType() !== null) {
      filtered = filtered.filter(
        (c) => c.taskTypes.includes(this.selectedTaskType()!),
      );
    }

    // Por severidad
    if (this.selectedSeverity() !== null) {
      filtered = filtered.filter((c) => c.severity === this.selectedSeverity());
    }

    // Por tecnología
    if (this.selectedTechnology()) {
      filtered = filtered.filter((c) =>
        c.technologies.includes(this.selectedTechnology()),
      );
    }

    this.filteredConventions.set(filtered);
  }

  getCriticalCount(): number {
    return this.conventions().filter((c) => c.severity === "CRÍTICA").length;
  }

  // Exponer funciones de utilidad al template
  protected readonly severityColor = severityColor;
  protected readonly severityIcon = severityIcon;
  protected readonly domainLabel = domainLabel;
  protected readonly taskTypeLabel = taskTypeLabel;
}
