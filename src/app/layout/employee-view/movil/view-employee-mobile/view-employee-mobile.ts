import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  MenuController,
} from "@ionic/angular/standalone";
import { Loader } from "@ui/mobile/loader/loader";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { HeaderMobile } from "../../../shared/header-mobile/header-mobile";
import { FooterEmployeeMobile } from "../footer-employee-mobile/footer-employee-mobile";
import { HomeMenu } from "../home-menu-mobile/home-menu-mobile";
@Component({
  selector: "app-view-employee-mobile",
  imports: [
    RouterOutlet,
    FooterEmployeeMobile,
    HeaderMobile,
    HomeMenu,
    IonApp,
    IonContent,
    IonHeader,
    IonToolbar,
    IonMenu,
    IonTitle,
    Loader,
  ],
  templateUrl: "./view-employee-mobile.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
      ion-app {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ViewEmployeeMobile implements OnInit {
  public navService = inject(MenuService);
  public hideScroolNavService = inject(HidescrollnavService);
  public layout = inject(LayoutService);
  private menuCtrl = inject(MenuController);

  ngOnInit() {
    document.body.setAttribute("data-layout", "vertical");
  }

  closeMenu() {
    this.menuCtrl.close("employee-mobile-menu");
  }

  get layoutClass() {
    return this.layout.config.settings.sidebar_type + "";
  }
}

