import { Injectable, signal } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class FeatureAnnouncementService {
  // Hardcoded version matching package.json or slightly simpler
  // In a real build pipeline, this could come from environment.ts
  private readonly CURRENT_VERSION = "5.0.2";

  public showDialog = signal<boolean>(false);

  constructor() {}

  public checkForUpdates(): void {
    const lastSeenVersion = localStorage.getItem("lastSeenVersion");

    if (lastSeenVersion !== this.CURRENT_VERSION) {
      // New version detected!
      this.showDialog.set(true);
    }
  }

  public markAsSeen(): void {
    localStorage.setItem("lastSeenVersion", this.CURRENT_VERSION);
    this.showDialog.set(false);
  }
}









