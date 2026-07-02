import { CommonModule, Location } from "@angular/common";
import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from "@angular/router";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SelectModule } from "primeng/select";
import { WebButtonIcon } from "src/app/core/components/buttons/web/icon";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { filter, map, startWith } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { ProfileMonitor } from "../../../employee-view/monitor/profile-monitor/profile-monitor";

@Component({
  selector: "app-header-direccion-monitor",
  imports: [
    BreadcrumbModule,
    CommonModule,
    FormsModule,
    ProfileMonitor,
    RouterModule,
    SelectModule,
    ToolbarModule,
    TooltipModule,
    WebButtonIcon,
  ],
  templateUrl: "./header-direccion-monitor.html",
  styleUrl: "./header-direccion-monitor.scss",
})
export class HeaderDireccionMonitor implements OnInit {
  public authS = inject(AuthService);
  public customerIdS = inject(CustomerIdService);
  public themeService = inject(ThemeService);
  public location = inject(Location);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public breadcrumbItems: MenuItem[] = [];
  public title: string = "";
  public customerId = this.customerIdS.customerId;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;
  public cb_customer = this.authS.customerAccess;

  private routeEventSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === PRIMARY_OUTLET),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const route = this.routeEventSignal();
      if (!route) return;
      this.title = route.snapshot.data["title"] || "";
      const parent = route.parent?.snapshot.data["breadcrumb"];
      const child = route.snapshot.data["breadcrumb"];
      this.breadcrumbItems = [{ icon: "pi pi-home", routerLink: "/direccion" }];
      if (parent) this.breadcrumbItems.push({ label: parent });
      if (child) this.breadcrumbItems.push({ label: child });
    });
  }

  ngOnInit(): void {}

  onBack = () => this.location.back();
  onForward = () => this.location.forward();
  onHome = () => this.router.navigateByUrl("/direccion");
  toggleTheme = () => this.themeService.toggleTheme();
  getThemeIcon = () =>
    this.themeService.getCurrentTheme() === "light"
      ? "pi pi-moon"
      : "pi pi-sun";
  selectCustomer = (newId: string) =>
    this.customerIdS.setCustomerId(newId).subscribe();
}
