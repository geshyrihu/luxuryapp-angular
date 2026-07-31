import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ConventionRule } from '../../conventions-viewer.service';
import {
  domainLabel,
  severityColor,
  severityIcon,
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

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }

  selectExample(tech: 'angular' | 'dotnet' | 'flutter'): void {
    this.selectedExample.set(this.selectedExample() === tech ? null : tech);
  }

  hasExample(tech: 'angular' | 'dotnet' | 'flutter'): boolean {
    return !!this.convention().examples?.[tech];
  }

  techIcon(tech: string): string {
    const iconMap: Record<string, string> = {
      angular: 'NG',
      '.net': 'NET',
      'c#': 'CS',
      flutter: 'FL',
      typescript: 'TS',
      css: 'CSS',
      dart: 'DA',
      documentacion: 'DOC',
    };

    return iconMap[tech.toLowerCase()] ?? 'GEN';
  }

  copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
  }

  protected readonly severityColor = severityColor;
  protected readonly severityIcon = severityIcon;
  protected readonly domainLabel = domainLabel;
  protected readonly taskTypeLabel = taskTypeLabel;

  primaryTaskLabel(): string {
    return taskTypeLabel(this.convention().taskTypes[0]);
  }
}
