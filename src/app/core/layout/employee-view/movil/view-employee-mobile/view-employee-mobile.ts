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
  ],
  templateUrl: "./view-employee-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        height: 100dvh;
        width: 100%;
      }
      ion-app {
        height: 100%;
        width: 100%;
      }
       .employee-mobile-content {
         --padding-bottom: calc(
           5rem + var(--ion-safe-area-bottom, env(safe-area-inset-bottom, 0px))
         );
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

