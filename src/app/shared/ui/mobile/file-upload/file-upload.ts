import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FileUploadBase, FileUploadEvent } from "@ui/base/file-upload.base";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cloudUploadOutline } from "ionicons/icons";

@Component({
  selector: "ili-file-upload",
  imports: [IonButton, IonIcon],
  template: `
    <div class="mobile-file-upload">
      <input 
        type="file" 
        [accept]="accept()" 
        [multiple]="multiple()" 
        (change)="onFileChange($event)" 
        #fileInput 
        style="display: none;" 
      />
      <ion-button (click)="fileInput.click()" expand="block" fill="outline">
        <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
        {{ chooseLabel() }}
      </ion-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliFileUpload extends FileUploadBase {
  constructor() {
    super();
    addIcons({ cloudUploadOutline });
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.onSelect.emit({ originalEvent: event, files });
      if (this.autoUpload()) {
        this.upload.emit({ originalEvent: event, files });
      }
    }
  }
}
