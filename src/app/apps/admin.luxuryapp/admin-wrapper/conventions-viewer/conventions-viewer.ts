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
  type SeverityType,
} from "./conventions-viewer.utils";

type TabType = "all" | "by-section" | "by-severity" | "by-technology";

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
  selectedSection = signal<number | null>(null);
  selectedSeverity = signal<SeverityType | null>(null);
  selectedTechnology = signal<string>("");

  // UI
  sections = signal([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
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

  filterBySection(section: number) {
    this.selectedSection.set(
      this.selectedSection() === section ? null : section,
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

    // Por sección
    if (this.selectedSection() !== null) {
      filtered = filtered.filter((c) => c.section === this.selectedSection());
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
}
