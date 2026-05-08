import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { arrowBack } from "ionicons/icons";
import { catchError, finalize, throwError } from "rxjs";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
@Component({
  selector: "app-recovery-mobile",
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonText,
    IonSpinner,
    IonApp,
  ],
  template: `
    <ion-app>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button (click)="goBack()">
              <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Recuperar Contraseña</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div
          class="flex flex-column align-items-center justify-content-center h-full"
        >
          <p class="text-center text-medium mb-4">
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            restablecer tu contraseña.
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-full">
            <ion-item class="mb-4">
              <ion-input
                label="Correo Electrónico"
                labelPlacement="floating"
                formControlName="email"
                type="email"
                placeholder="ejemplo@correo.com"
              ></ion-input>
            </ion-item>

            @if (errorMessage) {
              <ion-text color="danger" class="block text-center mb-3">
                <p>{{ errorMessage }}</p>
              </ion-text>
            }

            @if (successMessage) {
              <ion-text color="success" class="block text-center mb-3">
                <p>{{ successMessage }}</p>
              </ion-text>
            }

            <ion-button
              expand="block"
              type="submit"
              [disabled]="form.invalid || submitting() || countdown > 0"
              class="mb-3"
            >
              @if (submitting()) {
                <ion-spinner name="crescent"></ion-spinner>
              } @else if (countdown > 0) {
                Reintentar en {{ countdown }}s
              } @else {
                Enviar Instrucciones
              }
            </ion-button>
          </form>
        </div>
      </ion-content>
    </ion-app>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      ion-app {
        position: relative;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class RecoveryMobile implements OnInit {
  private fb = inject(FormBuilder);
  private dataConnectorS = inject(DataConnectorService);
  private router = inject(Router);
  form: FormGroup;
  submitting = signal(false);
  errorMessage = "";
  successMessage = "";
  countdown = 0;

  constructor() {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  goBack() {
    this.router.navigate(["/auth/login"]);
  }

  onSubmit() {
    if (this.form.invalid || this.countdown > 0) return;

    this.submitting.set(true);
    this.errorMessage = "";
    this.successMessage = "";

    const urlApi = "Auth/RecoverPassword";
    const body = this.form.value;

    this.dataConnectorS
      .post(urlApi, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message || "Ocurrió un error inesperado";
          return throwError(() => new Error(this.errorMessage));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage =
            response.body?.message ||
            "Si el correo existe, recibirás instrucciones.";
          this.startCountdown();
        },
      });
  }

  startCountdown() {
    this.countdown = 30;
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}
