import { Directive, inject } from "@angular/core";
import { LoaderService } from "src/app/core/services/loader.service";

@Directive()
export abstract class LoaderBase {
  protected loaderService = inject(LoaderService);
  isLoading = this.loaderService.loading$;
}
