import { Directive, input } from "@angular/core";
import { BaseIonicButton } from "../shared/buttons/base/base-ionic-button";

@Directive()
export abstract class IiButtonBase extends BaseIonicButton {
  color = input<string>("primary");
  fill = input<"clear" | "outline" | "solid" | "default">("solid");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");
}
