import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  logOutOutline,
  personOutline,
  refreshOutline,
  syncOutline,
  keyOutline,
} from "ionicons/icons";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ProfielService } from "src/app/core/auth/services/profiel-service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { MenuService } from "src/app/core/services/menu.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-profile-user-mobile",
  imports: [
    AppIcon,
    RouterModule,
    FormsModule,
    FormsModule,
    IonAvatar,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./profile-user.html",
})
export class ProfileUserMobile {
  updateService = inject(UpdateService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);

  profileRoute = computed(() =>
    this.aspRoleS.roleSignal(EApplicationRole.Direccion)()
      ? "/direccion/profile/update-user-profile"
      : "/profile/update-user-profile",
  );
  menuService = inject(MenuService);
  profielServiceService = inject(ProfielService);
  router = inject(Router);
  private consoleLogger = inject(ConsoleLoggerService);
  public isShow: boolean = false;
  infoAccountAuthDTO: InfoAccountAuthDTO;
  profileImageUrl: string = "";

  // Signal para imagen actualizada
  private updatedImageSignal = toSignal(
    this.profielServiceService.imagenPerfilActualizada$,
    { initialValue: null },
  );
  cb_customer: ISelectItem[] = [];
  customerId: Signal<string>; // Changed from number to string (Guid)
  customerPhotoPath = this.customerIdS.customerPhotoPath();

  public isChangingCustomer = false; // Para feedback visual
  customerName = this.customerIdS.nombreCorto;

  constructor() {
    addIcons({ personOutline, syncOutline, refreshOutline, logOutOutline, keyOutline });

    effect(() => {
      const currentCustomerId = this.customerIdS.customerId();
      if (currentCustomerId) {
        // Changed from > 0 to truthy check (non-empty string)
        this.customerPhotoPath = this.customerIdS.customerPhotoPath();
      }
    });
    this.infoAccountAuthDTO = this.authS.infoUserAuth;
    this.profileImageUrl = this.infoAccountAuthDTO.photoPath;
    this.cb_customer = this.authS.customerAccess;

    this.customerId = this.customerIdS.customerId;

    // Effect para actualizar imagen de perfil
    effect(() => {
      const newImg: any = this.updatedImageSignal();
      if (newImg) {
        this.profileImageUrl = newImg.imagenUrl;
      }
    });
  }

  selectCustomer(newCustomerId: string) {
    // Changed from any to string (Guid)
    // 1. Muestra un indicador de carga
    this.isChangingCustomer = true;
    this.consoleLogger.info(
      `[Profile ] Iniciando cambio a customerId: ${newCustomerId}`,
    );
    // 2. Llama al método Y SE SUSCRIBE para saber cuándo termina.
    this.customerIdS.setCustomerId(newCustomerId).subscribe({
      next: (success) => {
        if (success) {
          this.consoleLogger.info(
            `[Profile ] Cambio a customerId: ${newCustomerId} completado con éxito.`,
          );
          // El 'effect' en Sidebar debería haberse disparado.
        } else {
          this.consoleLogger.error("[Profile ] El cambio de cliente falló.");
        }
      },
      // 3. Oculta el indicador de carga, tanto si tuvo éxito como si falló.
      complete: () => {
        this.isChangingCustomer = false;
      },
    });
  }

  logOut() {
    this.authS.logout().subscribe();
  }

  async onForceReload(): Promise<void> {
    try {
      this.consoleLogger.custom(
        "🧹",
        "color: #E91E63; font-weight: bold;",
        "[Profile] Limpiando caché y recargando...",
      );

      // 1. Eliminar todos los cachés del Service Worker
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
        this.consoleLogger.info(
          `[Profile] ${cacheNames.length} cachés eliminados`,
        );
      }

      // 2. Desregistrar el Service Worker (opcional, más agresivo)
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
        this.consoleLogger.info(`[Profile] Service Workers desregistrados`);
      }

      // 3. Recargar la página
      window.location.reload();
    } catch (error) {
      this.consoleLogger.error("[Profile] Error al limpiar caché:", error);
      // Intenta recargar de todos modos
      window.location.reload();
    }
  }
}
