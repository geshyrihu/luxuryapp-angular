import { Directive, input } from "@angular/core";

@Directive()
export abstract class GalleryBase {
  images = input<any[]>([]);
  thumbnailPosition = input<"bottom" | "top" | "left" | "right">("bottom");
}
