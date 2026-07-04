import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelConfirm } from "src/app/core/components/buttons/web-label/button-confirm";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IJuntaMensualSessionBackfillMatch {
  id: string;
  type: string;
  title: string;
  relevantDate: string | null;
  score: number;
  confidence: string;
  reasons: string[];
}

interface IJuntaMensualSessionBackfillCandidate {
  juntaMensualSessionId: string;
  customerId: string;
  customerName: string;
  customerShortName: string;
  sessionTitle: string;
  sessionTypeDisplayName: string;
  scheduledAt: string;
  statusDisplayName: string;
  hasPresentationLinked: boolean;
  hasMeetingLinked: boolean;
  suggestedPresentation: IJuntaMensualSessionBackfillMatch | null;
  suggestedMeeting: IJuntaMensualSessionBackfillMatch | null;
}

interface IBackfillSelectionState {
  applyPresentation: boolean;
  applyMeeting: boolean;
  applying: boolean;
}

import { WebButtonIconConfirm } from "src/app/core/components/buttons/web-icon/button-confirm";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-juntas-mensuales-backfill",
  templateUrl: "./juntas-mensuales-backfill.html",
  imports: [
    WebButtonIconConfirm,
    TooltipModule,
    CommonModule,
    TableModule,
    TagModule,
    CardModule,
    WebButtonLabel,
    WebButtonLabelConfirm,
    DatePipe,
  ],
})
export class JuntasMensualesBackfill {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);

  readonly loading = signal(false);
  readonly items = signal<IJuntaMensualSessionBackfillCandidate[]>([]);
  readonly selectionState = signal<Record<string, IBackfillSelectionState>>({});
  readonly windowDays = signal(7);
  readonly scopedCustomerId = computed(() => this.customerIdS.customerId());
  readonly pendingCount = computed(
    () =>
      this.items().filter(
        (item) => !item.hasPresentationLinked || !item.hasMeetingLinked,
      ).length,
  );
  readonly autoApplicableCount = computed(
    () => this.items().filter((item) => this.hasSomethingToApply(item)).length,
  );

  constructor() {
    effect(() => {
      this.customerIdS.customerId();
      this.windowDays();
      this.onLoadData();
    });
  }

  onLoadData() {
    const query = new URLSearchParams();
    query.set("windowDays", String(this.windowDays()));

    const customerId = this.scopedCustomerId();
    if (customerId) {
      query.set("customerId", customerId);
    }

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IJuntaMensualSessionBackfillCandidate[]>(
        `${Endpoints.JuntaMensualSessionBackfill.preview}?${query.toString()}`,
      )
      .then((result) => {
        const items = result || [];
        this.items.set(items);
        this.selectionState.set(this.buildSelectionState(items));
      })
      .finally(() => this.loading.set(false));
  }

  onWindowDaysChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    const parsed = Number(target?.value ?? 7);
    this.windowDays.set(
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 30) : 7,
    );
  }

  onTogglePresentation(sessionId: string, event: Event) {
    const checked = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.selectionState.update((state) => ({
      ...state,
      [sessionId]: {
        ...this.resolveSelectionState(sessionId),
        applyPresentation: checked,
      },
    }));
  }

  onToggleMeeting(sessionId: string, event: Event) {
    const checked = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.selectionState.update((state) => ({
      ...state,
      [sessionId]: {
        ...this.resolveSelectionState(sessionId),
        applyMeeting: checked,
      },
    }));
  }

  onApply(item: IJuntaMensualSessionBackfillCandidate) {
    const state = this.resolveSelectionState(item.juntaMensualSessionId);
    const dto = {
      juntaMensualSessionId: item.juntaMensualSessionId,
      presentacionJuntaComiteId:
        state.applyPresentation && item.suggestedPresentation
          ? item.suggestedPresentation.id
          : null,
      meetingId:
        state.applyMeeting && item.suggestedMeeting
          ? item.suggestedMeeting.id
          : null,
    };

    this.selectionState.update((current) => ({
      ...current,
      [item.juntaMensualSessionId]: {
        ...state,
        applying: true,
      },
    }));

    this.apiResponseS
      .onPost(Endpoints.JuntaMensualSessionBackfill.apply, dto)
      .then((result) => {
        if (!result) return;
        this.onLoadData();
      })
      .finally(() => {
        this.selectionState.update((current) => ({
          ...current,
          [item.juntaMensualSessionId]: {
            ...this.resolveSelectionState(item.juntaMensualSessionId),
            applying: false,
          },
        }));
      });
  }

  hasSomethingToApply(item: IJuntaMensualSessionBackfillCandidate) {
    const state = this.resolveSelectionState(item.juntaMensualSessionId);
    return (
      (state.applyPresentation && !!item.suggestedPresentation) ||
      (state.applyMeeting && !!item.suggestedMeeting)
    );
  }

  isApplying(sessionId: string) {
    return this.resolveSelectionState(sessionId).applying;
  }

  hasScopedCustomer() {
    return !!this.scopedCustomerId();
  }

  confidenceSeverity(
    confidence: string,
  ): "success" | "info" | "warn" | "danger" {
    switch (confidence?.toLowerCase()) {
      case "alta":
        return "success";
      case "media":
        return "warn";
      case "baja":
        return "danger";
      default:
        return "info";
    }
  }

  private buildSelectionState(items: IJuntaMensualSessionBackfillCandidate[]) {
    return items.reduce<Record<string, IBackfillSelectionState>>(
      (acc, item) => {
        acc[item.juntaMensualSessionId] = {
          applyPresentation:
            !!item.suggestedPresentation && !item.hasPresentationLinked,
          applyMeeting: !!item.suggestedMeeting && !item.hasMeetingLinked,
          applying: false,
        };
        return acc;
      },
      {},
    );
  }

  private resolveSelectionState(sessionId: string): IBackfillSelectionState {
    return (
      this.selectionState()[sessionId] ?? {
        applyPresentation: false,
        applyMeeting: false,
        applying: false,
      }
    );
  }
}
