import { inject, Injectable } from "@angular/core";
import { StorageService } from "src/app/core/services/storage.service";

@Injectable({
  providedIn: "root",
})
export class DateRangeStorageService {
  private storageKey = "ticketDateRange";
  private storageS = inject(StorageService);

  saveDateRange(from: Date | null, to: Date | null): void {
    if (from && to) {
      this.storageS.store(this.storageKey, {
        from: from.toISOString(),
        to: to.toISOString(),
      });
    }
  }

  getDateRange(): { from: Date | null; to: Date | null } {
    const savedDates = this.storageS.retrieve(this.storageKey);
    if (savedDates) {
      return {
        from: new Date(savedDates.from),
        to: new Date(savedDates.to),
      };
    }
    return { from: null, to: null };
  }

  clearDateRange(): void {
    this.storageS.remove(this.storageKey);
  }
}
