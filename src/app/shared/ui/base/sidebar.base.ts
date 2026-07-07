import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class SidebarBase {
  visible = model<boolean>(false);
  position = input<"left" | "right" | "top" | "bottom">("left");
  closable = input<boolean>(true);
  header = input<string>("");

  dismiss = output<void>();

  onHide(): void {
    this.visible.set(false);
    this.dismiss.emit();
  }
}
