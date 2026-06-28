import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LiveRegionAnnouncer {
  private announcer: HTMLElement | null = null;

  announce(message: string, priority: "polite" | "assertive" = "polite"): void {
    if (!this.announcer) {
      this.announcer = document.createElement("div");
      this.announcer.setAttribute("aria-live", priority);
      this.announcer.setAttribute("aria-atomic", "true");
      this.announcer.style.cssText =
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
      document.body.appendChild(this.announcer);
    }
    this.announcer.setAttribute("aria-live", priority);
    this.announcer.textContent = "";
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = message;
      }
    }, 50);
  }
}
