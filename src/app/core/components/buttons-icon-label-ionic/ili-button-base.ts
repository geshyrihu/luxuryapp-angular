import { Directive, input } from "@angular/core";
import { BaseIonicButton } from "../shared/buttons/base/base-ionic-button";

@Directive()
export abstract class IliButtonBase extends BaseIonicButton {
  color = input<string>("primary");
  fill = input<"clear" | "outline" | "solid" | "default">("solid");
  expand = input<"block" | "full" | "">("");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");
}
