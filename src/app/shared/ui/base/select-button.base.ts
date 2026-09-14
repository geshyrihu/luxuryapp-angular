import { Directive, input, model } from "@angular/core";

export interface SelectButtonOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Directive()
export abstract class SelectButtonBase {
  options = input<SelectButtonOption[]>([]);
  value = model<any>(undefined);
  disabled = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);
}
