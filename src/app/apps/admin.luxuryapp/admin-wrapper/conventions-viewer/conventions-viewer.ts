import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ConventionCard } from './components/convention-card/convention-card';
import {
  ConventionRule,
  ConventionsService,
} from './conventions-viewer.service';
import {
  domainLabel,
  severityColor,
  severityIcon,
  taskTypeLabel,
  type ConventionDomain,
  type ConventionTaskType,
  type SeverityType,
} from './conventions-viewer.utils';

type TabType = 'all' | 'by-domain' | 'by-task' | 'by-severity' | 'by-technology';

@Component({
  selector: 'app-conventions-viewer',
  imports: [ConventionCard],
  templateUrl: './conventions-viewer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./conventions-viewer.scss'],
})
export class ConventionsViewer implements OnInit {
  private readonly service = inject(ConventionsService);

  conventions = signal<ConventionRule[]>([]);
  filteredConventions = signal<ConventionRule[]>([]);
  activeTab = signal<TabType>('all');
  searchQuery = signal('');
  selectedDomain = signal<ConventionDomain | null>(null);
  selectedTaskType = signal<ConventionTaskType | null>(null);
  selectedSeverity = signal<SeverityType | null>(null);
  selectedTechnology = signal('');

  domains = signal<ConventionDomain[]>([
    'core',
    'backend',
    'frontend',
    'flutter',
    'ui',
    'styles',
    'catalogs',
    'audit',
    'operations',
  ]);
  taskTypes = signal<ConventionTaskType[]>([
    'creacion-modulo-fase-0',
    'implementacion-backend',
    'implementacion-frontend',
    'implementacion-flutter',
    'auditoria',
    'documentacion',
    'operacion-transversal',
  ]);
  severities = signal<SeverityType[]>(['CRÍTICA', 'ALTA', 'MEDIA', 'BAJA']);
  technologies = signal([
    'Angular',
    '.NET',
    'C#',
    'TypeScript',
    'Flutter',
    'Dart',
    'CSS',
    'Documentacion',
  ]);

  ngOnInit(): void {
    this.loadConventions();
  }

  private loadConventions(): void {
    this.service.getConventions().subscribe((conventions) => {
      this.conventions.set(conventions);
      this.updateFiltered();
    });
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    this.updateFiltered();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);

    if (query.trim()) {
      this.service.searchConventions(query).subscribe((results) => {
        this.filteredConventions.set(results);
      });
      return;
    }

    this.updateFiltered();
  }

  filterByDomain(domain: ConventionDomain): void {
    this.selectedDomain.set(this.selectedDomain() === domain ? null : domain);
    this.updateFiltered();
  }

  filterByTaskType(taskType: ConventionTaskType): void {
    this.selectedTaskType.set(this.selectedTaskType() === taskType ? null : taskType);
    this.updateFiltered();
  }

  filterBySeverity(severity: SeverityType): void {
    this.selectedSeverity.set(this.selectedSeverity() === severity ? null : severity);
    this.updateFiltered();
  }

  filterByTechnology(technology: string): void {
    this.selectedTechnology.set(this.selectedTechnology() === technology ? '' : technology);
    this.updateFiltered();
  }

  private updateFiltered(): void {
    let filtered = this.conventions();

    if (this.selectedDomain() !== null) {
      filtered = filtered.filter((convention) => convention.domain === this.selectedDomain());
    }

    if (this.selectedTaskType() !== null) {
      filtered = filtered.filter((convention) =>
        convention.taskTypes.includes(this.selectedTaskType()!),
      );
    }

    if (this.selectedSeverity() !== null) {
      filtered = filtered.filter(
        (convention) => convention.severity === this.selectedSeverity(),
      );
    }

    if (this.selectedTechnology()) {
      filtered = filtered.filter((convention) =>
        convention.technologies.includes(this.selectedTechnology()),
      );
    }

    this.filteredConventions.set(filtered);
  }

  getCriticalCount(): number {
    return this.conventions().filter((convention) => convention.severity === 'CRÍTICA').length;
  }

  protected readonly severityColor = severityColor;
  protected readonly severityIcon = severityIcon;
  protected readonly domainLabel = domainLabel;
  protected readonly taskTypeLabel = taskTypeLabel;
}
