// import { CommonModule } from "@angular/common";
// import { Component, inject, input } from "@angular/core";
// import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
// import { addIcons } from "ionicons";
// import { chevronForwardOutline, documentOutline } from "ionicons/icons";
// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { PdfViewerModal } from "../../../shared/pdf-viewer-modal/pdf-viewer-modal";
// import { BaseIonicButton } from "../../revisar-si.sirve/base/base-ionic-button";

// @Component({
//   selector: "ion-button-view-pdf",
//   imports: [CommonModule, IonItem, IonLabel, IonIcon],
//   template: `
//     <ion-item
//       button
//       detail="false"
//       lines="none"
//       [disabled]="disabled()"
//       [class]="customClass()"
//       (click)="viewPdf()"
//       style="--background:#f8fafc;--background-activated:#f1f5f9;--border-radius:14px;
//              --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
//              margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
//     >
//       <div
//         slot="start"
//         style="width:38px;height:38px;border-radius:10px;background:#e2e8f0;
//            display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;"
//       >
//         <ion-icon
//           name="document-outline"
//           style="font-size:20px;color:#475569;"
//         />
//       </div>
//       <ion-label
//         style="font-weight:600;font-size:15px;color:var(--secondary-800);"
//       >
//         {{ label() || "Ver archivo" }}
//       </ion-label>
//       <ion-icon
//         name="chevron-forward-outline"
//         slot="end"
//         style="color:var(--secondary-400);font-size:16px;"
//       />
//     </ion-item>
//   `,
// })
// export class IonButtonViewPdf extends BaseIonicButton {
//   private readonly dialogHandlerS = inject(DialogHandlerService);

//   url = input<string>("");
//   fileName = input<string>("");

//   viewPdf(): void {
//     this.dialogHandlerS.openDialog(
//       PdfViewerModal,
//       { pdfSrc: this.url(), fileName: this.fileName() },
//       this.fileName(),
//       this.dialogHandlerS.sizeFull,
//       true,
//     );
//   }

//   constructor() {
//     super();
//     addIcons({ documentOutline, chevronForwardOutline });
//   }
// }
