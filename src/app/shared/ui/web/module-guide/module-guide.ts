import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  ModuleFlowAnalysis,
  Flow,
  Endpoint,
  ComponentInfo,
  DomainEvent,
  FlowStep,
} from './models/flow-analysis.model';

@Component({
  selector: 'app-module-guide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-guide.html',
  styleUrls: ['./module-guide.css'],
})
export class ModuleGuide implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signals para estado reactivo
  analysis = signal<ModuleFlowAnalysis | null>(null);
  selectedFlow = signal<Flow | null>(null);
  activeTab = signal<'overview' | 'flows' | 'endpoints' | 'components' | 'events'>('overview');
  searchQuery = signal('');
  loading = signal(true);
  loadError = signal<string | null>(null);

  // Computed signals para filtros
  filteredFlows = computed(() => {
    const flows = this.analysis()?.flows || [];
    const query = this.searchQuery().toLowerCase();
    if (!query) return flows;
    return flows.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.trigger.toLowerCase().includes(query),
    );
  });

  filteredEndpoints = computed(() => {
    const endpoints = this.analysis()?.endpoints || [];
    const query = this.searchQuery().toLowerCase();
    if (!query) return endpoints;
    return endpoints.filter(
      (e) =>
        e.path.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.method.toLowerCase().includes(query),
    );
  });

  filteredComponents = computed(() => {
    const components = this.analysis()?.components || [];
    const query = this.searchQuery().toLowerCase();
    if (!query) return components;
    return components.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.purpose.toLowerCase().includes(query) ||
        c.selector.toLowerCase().includes(query),
    );
  });

  filteredEvents = computed(() => {
    const events = this.analysis()?.domainEvents || [];
    const query = this.searchQuery().toLowerCase();
    if (!query) return events;
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.handler.toLowerCase().includes(query) ||
        e.actions.some((a) => a.toLowerCase().includes(query)),
    );
  });

  ngOnInit(): void {
    this.loadAnalysis();
  }

  loadAnalysis(): void {
    const moduleName = this.route.snapshot.paramMap.get('module') || 'espejo-aspel-full';
    const url = `/assets/flow-analysis/${moduleName}.json`;

    this.loading.set(true);
    this.loadError.set(null);

    firstValueFrom(this.http.get<ModuleFlowAnalysis>(url))
      .then((data) => {
        this.analysis.set(data);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Error loading flow analysis:', err);
        this.loadError.set(`No se pudo cargar el análisis para "${moduleName}": ${err.message}`);
        this.loading.set(false);
      });
  }

  selectFlow(flow: Flow): void {
    this.selectedFlow.set(flow);
    this.activeTab.set('flows');
  }

  setActiveTab(tab: 'overview' | 'flows' | 'endpoints' | 'components' | 'events'): void {
    this.activeTab.set(tab);
    this.selectedFlow.set(null);
  }

  getMethodColor(method: string): string {
    const colors: Record<string, string> = {
      GET: '#61affe',
      POST: '#49cc90',
      PUT: '#fca130',
      PATCH: '#fca130',
      DELETE: '#f93e3e',
      INTERNAL: '#999',
      EVENT: '#d946ef',
    };
    return colors[method] || '#999';
  }

  getActorColor(actor: string): string {
    const colors: Record<string, string> = {
      Frontend: '#3b82f6',
      Backend: '#8b5cf6',
      Database: '#06b6d4',
      External: '#f59e0b',
      User: '#ec4899',
      Scheduler: '#6366f1',
    };
    return colors[actor] || '#6b7280';
  }

  getChannelColor(channel: string): string {
    const colors: Record<string, string> = {
      Email: '#3b82f6',
      Push: '#8b5cf6',
      SignalR: '#06b6d4',
      InApp: '#10b981',
      SMS: '#f59e0b',
      Webhook: '#ef4444',
    };
    return colors[channel] || '#6b7280';
  }

  formatDuration(ms?: number): string {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  trackByFlowId(index: number, flow: Flow): string {
    return flow.id;
  }

  trackByEndpointPath(index: number, endpoint: Endpoint): string {
    return endpoint.path;
  }

  trackByComponentName(index: number, comp: ComponentInfo): string {
    return comp.name;
  }

  trackByEventName(index: number, event: DomainEvent): string {
    return event.name;
  }

  trackByStepOrder(index: number, step: FlowStep): number {
    return step.order;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}