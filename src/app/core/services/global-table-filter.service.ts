import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalTableFilterService {
  readonly filterTerm = signal<string>("");

  setFilter(term: string): void {
    this.filterTerm.set(term);
  }

  clear(): void {
    this.filterTerm.set("");
  }
}
