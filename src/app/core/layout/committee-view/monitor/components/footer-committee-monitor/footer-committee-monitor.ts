import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-footer-committee-monitor",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./footer-committee-monitor.html",
})
export class FooterCommitteeMonitor {
  public today: Date = new Date();
  public year: number = this.today.getFullYear();
}









