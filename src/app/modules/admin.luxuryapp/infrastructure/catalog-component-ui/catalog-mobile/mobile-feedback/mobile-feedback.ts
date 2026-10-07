import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonProgressBar, IonSkeletonText, IonSpinner } from "@ionic/angular";

@Component({
  selector: "app-mobile-feedback",
  imports: [IonProgressBar, IonSkeletonText, IonSpinner],
  template: `<div class="mobile-card"><div class="mobile-card-header">Feedback</div><div class="mobile-card-body d-flex flex-column gap-3"><ion-progress-bar [value]="0.65" aria-label="Progreso de carga" /><ion-spinner name="crescent" aria-label="Cargando" /><ion-skeleton-text [animated]="true" style="width: 80%; height: 1rem" /></div></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFeedback {}
