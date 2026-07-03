import { Directive, input } from "@angular/core";
import { BaseIonicButton } from "./base/base-ionic-button";

@Directive()
export abstract class MobileButtonBase extends BaseIonicButton {
  color = input<string>("primary");
  fill = input<"clear" | "outline" | "solid" | "default">("solid");
  expand = input<"block" | "full" | "">("");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");
}
