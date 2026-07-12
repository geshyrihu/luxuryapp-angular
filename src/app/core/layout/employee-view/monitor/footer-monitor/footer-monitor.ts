import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-footer-monitor",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-fluid">
      <div class="grid">
        <div class="col-md-12 footer-copyright text-center">
          <p class="mb-0">Copyright {{ currentYear }} © LuxuryApp</p>
        </div>
      </div>
    </div>
  `,
})
export class FooterMonitor {
  currentYear: number = new Date().getFullYear();
}
