import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { FooterDirecciondesktop } from "../components/footer-direccion-desktop/footer-direccion-desktop";
import { HeaderDirecciondesktop } from "../header-direccion-desktop/header-direccion-desktop";

@Component({
  selector: "app-view-direccion-desktop",
  imports: [RouterOutlet, HeaderDirecciondesktop, FooterDirecciondesktop, LxLoader],
  templateUrl: "./view-direccion-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./view-direccion-desktop.scss",
})
export class ViewDirecciondesktop {}

