import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, computed, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { InputText } from "@ui/inputs/adaptive/input-text/input-text";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { KeyValuePair } from "./interfaces/key-value-pair.interface";
import { HistoryEntry } from "./interfaces/history-entry.interface";

@Component({
  selector: "app-mini-postman",
  templateUrl: "./mini-postman.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    LxTabs,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    InputText,
    WebButtonLabel,
    WebButtonIcon,
    AppIcon,
  ],
})
export class MiniPostman {
  private http = inject(HttpClient);

  readonly baseUrl = environment.API_BASE_URL;

  readonly methods = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "PATCH", value: "PATCH" },
    { label: "DELETE", value: "DELETE" },
  ];

  // --- Request state ---
  method = signal("GET");
  url = signal("");
  useBaseUrl = signal(true);
  bodyRaw = signal("");
  headers = signal<KeyValuePair[]>([{ key: "", value: "", enabled: true }]);
  params = signal<KeyValuePair[]>([{ key: "", value: "", enabled: true }]);

  // --- Tabs state ---
  activeTabReq = signal("params");
  activeTabRes = signal("body-res");

  readonly reqTabs = computed(() => {
    const tabs = [
      { id: "params", label: "Params" },
      { id: "headers", label: "Headers" },
    ];
    if (this.hasBody()) {
      tabs.push({ id: "body", label: "Body" });
    }
    return tabs;
  });

  readonly resTabs = [
    { id: "body-res", label: "Body" },
    { id: "headers-res", label: "Headers" }
  ];

  // --- Response state ---
  loading = signal(false);
  statusCode = signal<number | null>(null);
  durationMs = signal<number | null>(null);
  responseBody = signal<string>("");
  responseHeaders = signal<Record<string, string>>({});
  responseError = signal<string>("");

  // --- History ---
  history = signal<HistoryEntry[]>([]);

  readonly hasBody = computed(() =>
    ["POST", "PUT", "PATCH"].includes(this.method()),
  );

  readonly statusClass = computed(() => {
    const s = this.statusCode();
    if (!s) return "";
    if (s < 300) return "text-green-500";
    if (s < 400) return "text-blue-500";
    if (s < 500) return "text-yellow-500";
    return "text-red-500";
  });

  readonly responseHeaderEntries = computed(() =>
    Object.entries(this.responseHeaders()),
  );

  readonly prettyResponse = computed(() => {
    const raw = this.responseBody();
    if (!raw) return "";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  });

  readonly fullUrl = computed(() => {
    const base = this.useBaseUrl() ? this.baseUrl : "";
    const path = this.url();
    const active = this.params().filter((p) => p.enabled && p.key);
    if (!active.length) return base + path;
    const qs = active
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    return `${base}${path}${path.includes("?") ? "&" : "?"}${qs}`;
  });

  async send(): Promise<void> {
    const target = this.fullUrl();
    if (!target) return;

    this.loading.set(true);
    this.responseBody.set("");
    this.responseHeaders.set({});
    this.responseError.set("");
    this.statusCode.set(null);
    this.durationMs.set(null);

    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    for (const h of this.headers().filter((h) => h.enabled && h.key)) {
      headers = headers.set(h.key, h.value);
    }

    const body = this.hasBody() ? this.bodyRaw() || null : null;
    const start = performance.now();

    try {
      const res = await lastValueFrom(
        this.http.request(this.method(), target, {
          headers,
          body,
          observe: "response",
          responseType: "text",
        }),
      );

      const elapsed = Math.round(performance.now() - start);
      this.statusCode.set(res.status);
      this.durationMs.set(elapsed);
      this.responseBody.set(res.body ?? "");

      const resHeaders: Record<string, string> = {};
      res.headers.keys().forEach((k) => {
        resHeaders[k] = res.headers.get(k) ?? "";
      });
      this.responseHeaders.set(resHeaders);

      this.pushHistory(this.method(), target, res.status, elapsed);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      const status = err?.status ?? 0;
      const errBody = err?.error ?? err?.message ?? "Error desconocido";
      this.statusCode.set(status);
      this.durationMs.set(elapsed);
      this.responseError.set(
        typeof errBody === "string"
          ? errBody
          : JSON.stringify(errBody, null, 2),
      );
      this.pushHistory(this.method(), target, status, elapsed);
    } finally {
      this.loading.set(false);
    }
  }

  onUrlInput(raw: string): void {
    const qIdx = raw.indexOf("?");
    if (qIdx === -1) {
      this.url.set(raw);
      return;
    }

    const path = raw.substring(0, qIdx);
    const qs = raw.substring(qIdx + 1);

    const parsed: KeyValuePair[] = [];
    new URLSearchParams(qs).forEach((value, key) => {
      parsed.push({ key, value, enabled: true });
    });

    this.url.set(path);

    if (path.startsWith("http")) {
      this.useBaseUrl.set(false);
    }

    if (parsed.length > 0) {
      this.params.set([...parsed, { key: "", value: "", enabled: true }]);
    }
  }

  updateParam(
    i: number,
    field: keyof KeyValuePair,
    value: string | boolean,
  ): void {
    this.params.update((arr) => {
      const copy = [...arr];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  }

  addParam(): void {
    this.params.update((p) => [...p, { key: "", value: "", enabled: true }]);
  }

  removeParam(i: number): void {
    this.params.update((p) => p.filter((_, idx) => idx !== i));
  }

  updateHeader(
    i: number,
    field: keyof KeyValuePair,
    value: string | boolean,
  ): void {
    this.headers.update((arr) => {
      const copy = [...arr];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  }

  addHeader(): void {
    this.headers.update((h) => [...h, { key: "", value: "", enabled: true }]);
  }

  removeHeader(i: number): void {
    this.headers.update((h) => h.filter((_, idx) => idx !== i));
  }

  loadFromHistory(entry: HistoryEntry): void {
    this.method.set(entry.method);
    this.url.set(
      this.useBaseUrl() ? entry.url.replace(this.baseUrl, "") : entry.url,
    );
  }

  clearHistory(): void {
    this.history.set([]);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  private pushHistory(
    method: string,
    url: string,
    status: number,
    ms: number,
  ): void {
    const entry: HistoryEntry = {
      method,
      url,
      statusCode: status,
      durationMs: ms,
      timestamp: new Date(),
    };
    this.history.update((h) => [entry, ...h].slice(0, 30));
  }

  methodBadgeClass(method: string): string {
    const map: Record<string, string> = {
      GET: "bg-blue-100 text-blue-700",
      POST: "bg-green-100 text-green-700",
      PUT: "bg-orange-100 text-orange-700",
      PATCH: "bg-yellow-100 text-yellow-700",
      DELETE: "bg-red-100 text-red-700",
    };
    return map[method] ?? "bg-gray-100 text-gray-700";
  }

  statusBadgeClass(code: number): string {
    if (code < 300) return "bg-green-100 text-green-700";
    if (code < 400) return "bg-blue-100 text-blue-700";
    if (code < 500) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  trackByIndex(i: number): number {
    return i;
  }
}
