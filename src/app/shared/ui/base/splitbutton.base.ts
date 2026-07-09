import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class SplitbuttonBase {
  styleClass = input<string>("");
  label = input<any>(undefined);
  model = input<any>(undefined);
  size = input<any>(undefined);
  severity = input<any>(undefined);
  disabled = input<any>(undefined);
  onClick = output<any>();
}
