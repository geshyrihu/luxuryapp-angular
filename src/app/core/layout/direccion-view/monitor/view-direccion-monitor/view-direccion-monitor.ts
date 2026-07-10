import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { FooterDireccionMonitor } from "../components/footer-direccion-monitor/footer-direccion-monitor";
import { HeaderDireccionMonitor } from "../header-direccion-monitor/header-direccion-monitor";

@Component({
  selector: "app-view-direccion-monitor",
  imports: [RouterOutlet, HeaderDireccionMonitor, FooterDireccionMonitor, LxLoader],
  templateUrl: "./view-direccion-monitor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./view-direccion-monitor.scss",
})
export class ViewDireccionMonitor {}

