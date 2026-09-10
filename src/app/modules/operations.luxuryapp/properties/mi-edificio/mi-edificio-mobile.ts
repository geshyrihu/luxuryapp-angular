import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CaratulaDTO } from "./interfaces/caratula.dto";

@Component({
  selector: "app-mi-edificio-mobile",
  imports: [AppIcon, LxAvatar],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mi-edificio-mobile.html",
})
export class MiEdificioMobile {
  data = input<CaratulaDTO>();
}
