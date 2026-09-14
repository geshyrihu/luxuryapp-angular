import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-footer-direccion-desktop",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./footer-direccion-desktop.html",
})
export class FooterDirecciondesktop {
  public today: Date = new Date();
  public year: number = this.today.getFullYear();
}
