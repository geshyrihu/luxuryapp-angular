// import { CommonModule } from "@angular/common";
// import { Component, inject, input, output } from "@angular/core";
// import {
//   AlertController,
//   IonIcon,
//   IonItem,
//   IonLabel,
// } from "@ionic/angular/standalone";
// import { addIcons } from "ionicons";
// import { checkmarkOutline, chevronForwardOutline } from "ionicons/icons";
// import { BaseIonicButton } from "../../revisar-si.sirve/base/base-ionic-button";

// @Component({
//   selector: "ion-button-confirm",
//   imports: [CommonModule, IonItem, IonLabel, IonIcon],
//   template: `
//     <ion-item
//       button
//       detail="false"
//       lines="none"
//       [disabled]="disabled()"
//       [class]="customClass()"
//       (click)="confirmAction($event)"
//       style="--background:#f0fdf4;--background-activated:#dcfce7;--border-radius:14px;
//              --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
//              margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
//     >
//       <div
//         slot="start"
//         style="width:38px;height:38px;border-radius:10px;background:#bbf7d0;
//            display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;"
//       >
//         @if (emoji()) {
//           <span style="font-size:20px;">{{ emoji() }}</span>
//         } @else {
//           <ion-icon
//             name="checkmark-outline"
//             style="font-size:20px;color:#15803d;"
//           />
//         }
//       </div>
//       <ion-label style="font-weight:600;font-size:15px;color:#15803d;">
//         {{ label() || "Confirmar" }}
//       </ion-label>
//       <ion-icon
//         name="chevron-forward-outline"
//         slot="end"
//         style="color:#86efac;font-size:16px;"
//       />
//     </ion-item>
//   `,
// })
// export class IonButtonConfirm extends BaseIonicButton {
//   private readonly alertCtrl = inject(AlertController);

//   swalTitle = input<string>("Confirmar");
//   swalText = input<string>("¿Está seguro de que desea realizar esta acción?");
//   swalConfirmButtonText = input<string>("Sí, confirmar");
//   swalCancelButtonText = input<string>("Cancelar");

//   confirmed = output<void>();

//   async confirmAction(event: Event): Promise<void> {
//     const alert = await this.alertCtrl.create({
//       header: this.swalTitle(),
//       message: this.swalText(),
//       buttons: [
//         { text: this.swalCancelButtonText(), role: "cancel" },
//         {
//           text: this.swalConfirmButtonText(),
//           role: "confirm",
//           handler: () => this.confirmed.emit(),
//         },
//       ],
//     });
//     await alert.present();
//   }

//   constructor() {
//     super();
//     addIcons({ checkmarkOutline, chevronForwardOutline });
//   }
// }
