import { Directive } from "@angular/core";
import { BaseButton } from "../shared/buttons/base/base-button";

@Directive()
export abstract class IwButtonBase extends BaseButton {
  protected isPrimeIcon(icon: string): boolean {
    return icon.startsWith("pi ");
  }
}
