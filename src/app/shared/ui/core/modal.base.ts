import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class ModalBase {
  visible = model<boolean>(false);
  header = input("");
  closable = input(true);

  dismiss = output<void>();

  onDismiss(): void {
    this.visible.set(false);
    this.dismiss.emit();
  }
}
