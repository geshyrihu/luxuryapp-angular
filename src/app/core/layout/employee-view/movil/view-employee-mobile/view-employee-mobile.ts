import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonFooter,
  MenuController,
} from "@ionic/angular";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { HidescrollnavService } from "@core/services/hidescrollnav.service";
import { LayoutService } from "@core/services/layout.service";
import { MenuService } from "@core/services/menu.service";
import { PanicButton } from "@operations.luxuryapp/panic-alert/panic-button/panic-button";
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
    IonFooter,
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
        bottom: calc(80px + env(safe-area-inset-bottom, 0px));
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


