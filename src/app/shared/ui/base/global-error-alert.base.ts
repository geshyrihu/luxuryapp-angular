import { Directive, inject, OnDestroy, OnInit } from "@angular/core";
import {
  GlobalErrorService,
  type GlobalError,
} from "src/app/core/http/services/global-error.service";

@Directive()
export abstract class GlobalErrorAlertBase implements OnInit, OnDestroy {
  protected globalErrorService = inject(GlobalErrorService);
  error: GlobalError | null = null;

  ngOnInit(): void {
    this.globalErrorService.error$.subscribe((error) => {
      this.error = error;
    });
  }

  onClose(): void {
    this.globalErrorService.clearError();
  }

  ngOnDestroy(): void {}
}
