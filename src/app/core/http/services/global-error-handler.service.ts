import { Injectable, ErrorHandler, inject, signal } from "@angular/core";

export interface ErrorEvent {
  message: string;
  stack?: string;
  timestamp: Date;
  handled: boolean;
}

@Injectable({
  providedIn: "root",
})
export class GlobalErrorService {
  readonly lastError = signal<ErrorEvent | null>(null);
  readonly errors = signal<ErrorEvent[]>([]);

  private readonly maxErrors = 50;

  captureError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    const event: ErrorEvent = {
      message: err.message,
      stack: err.stack,
      timestamp: new Date(),
      handled: false,
    };
    this.lastError.set(event);
    this.errors.update((list) => {
      const next = [event, ...list];
      return next.length > this.maxErrors ? next.slice(0, this.maxErrors) : next;
    });
  }

  markHandled(): void {
    this.lastError.update((e) => (e ? { ...e, handled: true } : null));
  }

  clear(): void {
    this.lastError.set(null);
  }
}

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  private errorService = inject(GlobalErrorService);

  override handleError(error: unknown): void {
    this.errorService.captureError(error);
    console.error("[GlobalErrorHandler]", error);
  }
}
