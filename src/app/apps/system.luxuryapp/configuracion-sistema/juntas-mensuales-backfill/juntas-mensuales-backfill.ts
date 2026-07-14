import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { BackfillSelectionState } from "./interfaces/backfill-selection-state.interface";
import { JuntaMensualSessionBackfillCandidate } from "./interfaces/junta-mensual-session-backfill-candidate.interface";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

@Component({
  selector: "app-juntas-mensuales-backfill",
  templateUrl: "./juntas-mensuales-backfill.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconConfirm,
    LxTooltipDirective,
    CommonModule,
    TableModule,
    LxTag,
    WebButtonLabel,

    DatePipe,
  ],
})
export class JuntasMensualesBackfill {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);

  readonly loading = signal(false);
  readonly items = signal<JuntaMensualSessionBackfillCandidate[]>([]);
  readonly selectionState = signal<Record<string, BackfillSelectionState>>({});
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
      .onGetList<JuntaMensualSessionBackfillCandidate[]>(
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

  onApply(item: JuntaMensualSessionBackfillCandidate) {
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

  hasSomethingToApply(item: JuntaMensualSessionBackfillCandidate) {
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

  private buildSelectionState(items: JuntaMensualSessionBackfillCandidate[]) {
    return items.reduce<Record<string, BackfillSelectionState>>((acc, item) => {
      acc[item.juntaMensualSessionId] = {
        applyPresentation:
          !!item.suggestedPresentation && !item.hasPresentationLinked,
        applyMeeting: !!item.suggestedMeeting && !item.hasMeetingLinked,
        applying: false,
      };
      return acc;
    }, {});
  }

  private resolveSelectionState(sessionId: string): BackfillSelectionState {
    return (
      this.selectionState()[sessionId] ?? {
        applyPresentation: false,
        applyMeeting: false,
        applying: false,
      }
    );
  }
}
