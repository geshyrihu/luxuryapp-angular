import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { HeaderEmployeeMonitor } from "../header-employee-monitor/header-employee-monitor";
import { Sidebar } from "../sidebar/sidebar";
@Component({
  selector: "app-view-employee-monitor",
  imports: [RouterOutlet, Sidebar, HeaderEmployeeMonitor, LxLoader],
  templateUrl: "./view-employee-monitor.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./view-employee-monitor.scss",
})
export class ViewEmployeeMonitor implements OnInit, AfterViewInit {
  public navService = inject(MenuService);
  public hideScroolNavService = inject(HidescrollnavService);
  public layout = inject(LayoutService);
  public footerFix = false;
  public footerLight = false;
  public footerDark: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    document.body.setAttribute("data-layout", "vertical"); // Establecer un atributo en el body del documento
  }

  get layoutClass() {
    return this.layout.config.settings.sidebar_type + "";
  }

  ngDoCheck() {
    if (window.location.pathname.includes("/page-layout/footer-dark")) {
      this.footerDark = true;
      this.footerLight = false;
      this.footerFix = false;
    } else if (window.location.pathname.includes("/page-layout/footer-light")) {
      this.footerLight = true;
      this.footerDark = false;
      this.footerFix = false;
    } else if (window.location.pathname.includes("/page-layout/footer-fixed")) {
      this.footerFix = true;
      this.footerLight = false;
      this.footerDark = false;
    }
  }

  ngOnDestroy() {
    this.footerDark = false;
  }
}
