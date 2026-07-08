import { Directive, input } from "@angular/core";

@Directive()
export abstract class SkeletonBase {
  width = input<string>("100%");
  height = input<string>("1rem");
  borderRadius = input<string>("4px");
  styleClass = input<string>("");
}