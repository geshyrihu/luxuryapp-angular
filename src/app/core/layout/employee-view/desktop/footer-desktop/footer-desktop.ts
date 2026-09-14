import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-footer-desktop",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 footer-copyright text-center">
          <p class="mb-0">Copyright {{ currentYear }} © LuxuryApp</p>
        </div>
      </div>
    </div>
  `,
})
export class Footerdesktop {
  currentYear: number = new Date().getFullYear();
}
