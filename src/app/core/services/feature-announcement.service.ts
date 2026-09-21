import { Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FeatureAnnouncementService {
  private readonly currentVersion = environment.APP_VERSION;

  public showDialog = signal<boolean>(false);

  constructor() {}

  public checkForUpdates(): void {
    const lastSeenVersion = localStorage.getItem("lastSeenVersion");

    if (lastSeenVersion !== this.currentVersion) {
      // New version detected!
      this.showDialog.set(true);
    }
  }

  public markAsSeen(): void {
    localStorage.setItem("lastSeenVersion", this.currentVersion);
    this.showDialog.set(false);
  }
}
