import { Component } from "@angular/core";

@Component({
  selector: "app-footer-direccion-monitor",
  imports: [],
  templateUrl: "./footer-direccion-monitor.html",
})
export class FooterDireccionMonitor {
  public today: Date = new Date();
  public year: number = this.today.getFullYear();
}
