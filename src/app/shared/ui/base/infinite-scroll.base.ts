import { Directive, input, output } from "@angular/core";

@Directive()
export abstract class InfiniteScrollBase {
  loading = input<boolean>(false);
  threshold = input<string>("100px");
  disabled = input<boolean>(false);

  loadMore = output<void>();
}
