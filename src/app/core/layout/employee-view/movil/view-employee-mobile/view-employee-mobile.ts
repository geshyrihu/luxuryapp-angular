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
import { LxLoader } from "@ui/adaptive/loader/loader";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { HeaderMobile } from "../../../shared/header-mobile/header-mobile";
import { FooterEmployeeMobile } from "../footer-employee-mobile/footer-employee-mobile";
import { HomeMenu } from "../home-menu-mobile/home-menu-mobile";
import { PanicButton } from "src/app/apps/operations.luxuryapp/panic-alert/components/panic-button/panic-button";
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
    LxLoader,
    PanicButton,
  ],
  templateUrl: "./view-employee-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      .panic-fab {
        position: fixed;
        bottom: 80px;
        right: 16px;
        z-index: 1000;
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

