import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { CaratulaDTO } from "./interfaces/caratula.dto";

@Component({
  selector: "app-mi-edificio-mobile",
  imports: [LxIcon, LxAvatar],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mi-edificio-mobile.html",
})
export class MiEdificioMobile {
  data = input<CaratulaDTO>();
}

