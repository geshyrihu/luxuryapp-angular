import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { IonInputImg } from "../../mobile/ion-input-img";
import { WebInputImg } from "../../web/input-img/input-img";

@Component({
  selector: "custom-input-img-signal",

  imports: [WebInputImg, IonInputImg],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputImg),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-img
        [id]="id()"
        [label]="label()"
        [readonly]="readonly()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-img
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
      />
    }
  `,
})
export class InputImg extends WebInputImg {
  protected platform = inject(PlatformService);
}
