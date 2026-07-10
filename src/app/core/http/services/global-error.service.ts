// src/app/core/http/services/global-error.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
export interface GlobalError {
  message: string;
  timestamp: Date;
  persistent?: boolean; // si debe mostrarse sin desaparecer
}

@Injectable({
  providedIn: "root",
})
export class GlobalErrorService {
  public errorSubject = new BehaviorSubject<GlobalError | null>(null);
  public error$ = this.errorSubject.asObservable();

  setGlobalError(message: string, persistent = true) {
    this.errorSubject.next({
      message,
      timestamp: new Date(),
      persistent,
    });
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
