import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { environment } from "src/environments/environment";

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
