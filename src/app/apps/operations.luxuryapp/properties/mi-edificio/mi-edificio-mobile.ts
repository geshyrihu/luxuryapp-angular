import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { environment } from "src/environments/environment";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-mi-edificio-mobile",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mi-edificio-mobile.html",
})
export class MiEdificioMobile {
  data = input<any>();
  baseUrlImg = environment.API_BASE_URL;
}
