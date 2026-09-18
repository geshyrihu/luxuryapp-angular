import { Injectable, signal } from "@angular/core";

export interface AppToastAction {
  onAction?: () => Promise<void> | void;
  actionLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  [key: string]: unknown;
}

export interface AppToastMessage {
  key?: string;
  severity?: "success" | "info" | "warn" | "error";
  summary?: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
  data?: AppToastAction;
}

interface ActiveToast extends AppToastMessage {
  id: number;
}

/**
 * MessageService — reemplazo propio del `MessageService` de PrimeNG
 * (`primeng/api`). [Fase 3 migración Bootstrap, 2026-09-13] Mismo
 * nombre y misma forma de `.add()`/`.clear()` para que los consumidores
 * existentes no cambien. Soporta el caso simple
 * (`{severity, summary, detail, life}`) y el avanzado con botones
 * (`data.onAction`/`data.onCancel`, usado por `app.ts`).
 */
@Injectable({ providedIn: "root" })
export class MessageService {
  private readonly _messages = signal<ActiveToast[]>([]);
  readonly messages = this._messages.asReadonly();
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  add(message: AppToastMessage): void {
    const id = ++this.nextId;
    this._messages.update((list) => [...list, { ...message, id }]);
    if (!message.sticky) {
      const timer = setTimeout(() => this.remove(id), message.life ?? 3000);
      this.timers.set(id, timer);
    }
  }

  clear(key?: string): void {
    if (key === undefined) {
      this.timers.forEach((t) => clearTimeout(t));
      this.timers.clear();
      this._messages.set([]);
      return;
    }
    this._messages.update((list) => list.filter((m) => m.key !== key));
  }

  remove(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._messages.update((list) => list.filter((m) => m.id !== id));
  }
}
