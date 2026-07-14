import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, NgZone, signal } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import type { ApiResponseDto } from "src/app/core/http/services/api-response.service";
import { UserTokenDto } from "src/app/core/interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { StorageService } from "src/app/core/services/storage.service";
import { environment } from "src/environments/environment";

// D:\repos\luxuryapp-api\client\angular\src\app\core\interfaces\auth-user-token.dto.ts
interface CustomerDetailDTO {
  id: string;
  nombreCorto: string;
  photoPath: string;
  nameCustomer: string;
}
@Injectable({
  providedIn: "root",
})
export class CustomerIdService {
  private storageS = inject(StorageService);
  private zone = inject(NgZone);
  private http = inject(HttpClient);
  private consoleLogger = inject(ConsoleLoggerService);

  private customerState = signal<{
    id: string; // Guid del customer activo
    nombreCorto: string;
    photoCustomer: string;
    customerName: string;
    isLoaded: boolean;
  }>({
    id: "",
    nombreCorto: "",
    photoCustomer: "",
    customerName: "",
    isLoaded: false,
  });

  public readonly customerId = computed(() => this.customerState().id);
  public readonly nombreCorto = computed(
    () => this.customerState().nombreCorto,
  );
  public readonly customerName = computed(
    () => this.customerState().customerName,
  );
  public readonly customerPhotoPath = computed(
    () => this.customerState().photoCustomer,
  );
  public readonly customerDataReady = computed(
    () => this.customerState().isLoaded,
  );

  public initializeCustomerStateAfterLogin(
    userTokenData: UserTokenDto,
  ): Observable<boolean> {
    if (!userTokenData) {
      this.consoleLogger.error(
        "[CustomerIdService] Se intentó inicializar sin datos de token.",
      );
      return of(false);
    }

    const customerIdFromStorage = this.storageS.retrieve("customerId");
    const customerAccessList = userTokenData.customerAccess || [];
    const defaultCustomerIdFromToken =
      userTokenData.infoUserAuthDTO?.customerId;
    let customerIDTOSet: string | null = null;

    if (customerIdFromStorage) {
      const storedId = customerIdFromStorage;
      const hasAccess = customerAccessList.some(
        (customer) => customer.value === storedId,
      );
      if (hasAccess) {
        customerIDTOSet = storedId;
      }
    }

    if (!customerIDTOSet) {
      customerIDTOSet = defaultCustomerIdFromToken;
    }

    if (customerIDTOSet) {
      this.storageS.store("customerId", customerIDTOSet);
      return this.loadDataForCustomer(customerIDTOSet);
    } else {
      this.consoleLogger.error(
        "[CustomerIdService] Critical error: No valid customerId found.",
      );
      return of(false);
    }
  }

  public setCustomerId(customerId: string): Observable<boolean> {
    const newId = customerId;
    if (!newId || newId === this.customerId()) {
      return of(true);
    }

    // Marcamos como no cargado para que los servicios dependientes reaccionen al cambio de estado
    this.customerState.update((s) => ({ ...s, isLoaded: false }));

    this.storageS.store("customerId", newId);
    return this.loadDataForCustomer(newId);
  }

  public clearCustomerData(): void {
    this.storageS.clear("customerId");
    this.customerState.set({
      id: "",
      nombreCorto: "",
      photoCustomer: "",
      customerName: "",
      isLoaded: false,
    });
  }

  private loadDataForCustomer(customerId: string): Observable<boolean> {
    if (!customerId) {
      this.clearCustomerData();
      return of(false);
    }

    return this.http
      .get<ApiResponseDto<CustomerDetailDTO>>(
        `${environment.API_BASE_URL}${Endpoints.Customers.getById(customerId)}`,
      )
      .pipe(
        tap((response) => {
          if (!response.success || !response.data) {
            this.consoleLogger.error(
              "[CustomerIdService] API retorno error o datos nulos.",
              response.message,
            );
            this.zone.run(() => {
              this.customerState.update((s) => ({ ...s, isLoaded: false }));
            });
            return;
          }
          this.zone.run(() => {
            this.customerState.set({
              id: response.data.id,
              nombreCorto: response.data.nombreCorto,
              photoCustomer: response.data.photoPath,
              customerName: response.data.nameCustomer,
              isLoaded: true,
            });
          });
        }),
        map((response) => response.success && !!response.data),
        catchError((error) => {
          this.consoleLogger.error(
            "[CustomerIdService] API call FAILED.",
            error,
          );
          this.zone.run(() => {
            this.customerState.update((s) => ({ ...s, isLoaded: false }));
          });
          return of(false);
        }),
      );
  }
}
