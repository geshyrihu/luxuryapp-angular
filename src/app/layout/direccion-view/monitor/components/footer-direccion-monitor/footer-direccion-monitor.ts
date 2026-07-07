import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-footer-direccion-monitor",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./footer-direccion-monitor.html",
})
export class FooterDireccionMonitor {
  public today: Date = new Date();
  public year: number = this.today.getFullYear();
}
