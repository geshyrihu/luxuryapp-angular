import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ToastModule } from "primeng/toast";
import { ToastBase } from "../../base/toast.base";

@Component({
  selector: "primeng-custom-toast",
  standalone: true,
  imports: [ToastModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <p-toast position="top-left" [baseZIndex]="99999" /> `,
})
export class PrimeNgCustomToast extends ToastBase {}
