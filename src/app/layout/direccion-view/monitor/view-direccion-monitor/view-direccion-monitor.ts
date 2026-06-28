import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Loader } from "src/app/core/components/shared/loader/loader";
import { FooterDireccionMonitor } from "../components/footer-direccion-monitor/footer-direccion-monitor";
import { HeaderDireccionMonitor } from "../header-direccion-monitor/header-direccion-monitor";

@Component({
  selector: "app-view-direccion-monitor",
  imports: [RouterOutlet, HeaderDireccionMonitor, FooterDireccionMonitor, Loader],
  templateUrl: "./view-direccion-monitor.html",
  styleUrl: "./view-direccion-monitor.scss",
})
export class ViewDireccionMonitor {}

