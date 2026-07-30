import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ConventionRule } from '../../conventions-viewer.service';
import {
  severityColor,
  severityIcon,
  domainLabel,
  taskTypeLabel,
} from '../../conventions-viewer.utils';

@Component({
  selector: 'app-convention-card',
  templateUrl: './convention-card.html',
  styleUrls: ['./convention-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConventionCard {
  convention = input.required<ConventionRule>();

  expanded = signal(false);
  selectedExample = signal<'angular' | 'dotnet' | 'flutter' | null>(null);

  toggleExpanded() {
    this.expanded.update((v) => !v);
  }

  selectExample(tech: 'angular' | 'dotnet' | 'flutter') {
    this.selectedExample.set(
      this.selectedExample() === tech ? null : tech,
    );
  }

  hasExample(tech: 'angular' | 'dotnet' | 'flutter'): boolean {
    return !!(this.convention().examples?.[tech]);
  }

  techIcon(tech: string): string {
    const iconMap: Record<string, string> = {
      angular: '🅰️',
      '.net': '🔷',
      'c#': '🔷',
      flutter: '🐦',
      typescript: '📘',
    };
    return iconMap[tech.toLowerCase()] ?? '💻';
  }

  copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
  }

  // Exponer funciones de utilidad al template
  protected readonly severityColor = severityColor;
  protected readonly severityIcon = severityIcon;
  protected readonly domainLabel = domainLabel;
  protected readonly taskTypeLabel = taskTypeLabel;

  primaryTaskLabel(): string {
    return taskTypeLabel(this.convention().taskTypes[0]);
  }
}
