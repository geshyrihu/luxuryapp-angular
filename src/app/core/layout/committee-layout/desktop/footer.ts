import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-footer-committee-desktop",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./footer.html",
})
export class FooterCommitteedesktop {
  public today: Date = new Date();
  public year: number = this.today.getFullYear();
}
