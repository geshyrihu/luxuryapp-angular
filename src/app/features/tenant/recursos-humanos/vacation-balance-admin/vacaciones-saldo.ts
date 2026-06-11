import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
// Alias para evitar colisiÃ³n de nombres con el mÃ³todo de instancia onGetSeverity.
import { getStatusSeverity as statusSeverityFn } from "src/app/features/tenant/recursos-humanos/helpers/status-severity.helper";
import { VacationBalanceDTO } from "src/app/features/tenant/recursos-humanos/interfaces/vacation-balance.interface";
import { VacationRequestMyDTO as VacationRequestHistoryDTO } from "src/app/features/tenant/recursos-humanos/interfaces/vacation-request.interface";

/**
 * DTO local para representar una solicitud de vacaciones del empleado.
 * Refleja los campos que devuelve el endpoint GET /my-vacation-requests.
 * Se define aquÃ³ para mantener el componente autÃ³nomo sin importar
 * un mÃ³dulo externo de interfaces adicional.
 */
export interface VacationRequestMyDTO extends VacationRequestHistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  /** DÃ­as hÃ³biles solicitados Ã³ calculados en tiempo real en el backend (RN-005). */
  requestedDays: number;
  /** Estado del pedido: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Cancelada'. */
  status: string;
  requestDate: string;
  approverFullName: string;
  approvalDate: string;
}

/**
 * ??? Componente de saldo de vacaciones del empleado autenticado.
 *
 * **Responsabilidades:**
 * - Mostrar el balance de dÃ­as (totales, usados, pendientes, disponibles) para el periodo de aniversario seleccionado.
 * - Permitir navegar entre periodos de aniversario histÃ³ricos mediante un selector de AÃ±o.
 * - Mostrar el historial de solicitudes filtrado por el periodo de aniversario seleccionado.
 * - Mostrar un banner de recordatorio cuando el aniversario estÃ³ prÃ³ximo y hay dÃ­as disponibles (RN-012).
 *
 * **Flujo de carga:**
 * 1. `ngOnInit` ? `loadAvailableYearsAndBalance()`
 * 2. Primero carga los aÃ±os disponibles (`/available-years`) para validar que `currentYear` sea vÃ³lido.
 * 3. Luego llama a `loadBalance()` que lanza en paralelo:
 *    - `/my-balance?year=X` ? obtiene el balance del periodo seleccionado (RN-010).
 *    - `/my-vacation-requests` ? obtiene todas las solicitudes del empleado.
 * 4. Las solicitudes se filtran client-side por el rango del periodo de aniversario (RN-002, RN-007).
 */
@Component({
  selector: "app-vacaciones-saldo",
  templateUrl: "./vacaciones-saldo.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ProgressSpinnerModule,
    CustomInputSelectSignal,
    MessageModule,
    TableModule,
    TagModule,
    DatePipe,
  ],
})
export class VacacionesSaldo implements OnInit {
  apiResponseS = inject(ApiResponseService);

  /** Balance de vacaciones del empleado para el periodo de aniversario seleccionado. */
  balance = signal<VacationBalanceDTO | null>(null);

  /** Solicitudes del empleado filtradas por el periodo de aniversario actual. */
  requests = signal<VacationRequestMyDTO[]>([]);

  /** Controla el spinner global de carga. */
  loading = signal(true);

  /** AÃ±o de inicio del periodo de aniversario actualmente seleccionado. Inicialmente el AÃ±o en curso. */
  currentYearControl = new FormControl<number>(new Date().getFullYear());
  get currentYear() {
    return this.currentYearControl.value!;
  }

  /** Lista de aÃ±os disponibles para el selector Ã³ desde el AÃ±o de ingreso hasta el AÃ±o actual. */
  availableYears: { label: string; value: number }[] = [];

  /** Controla si se muestra el banner de recordatorio de vacaciones prÃ³ximas a vencer. */
  showAnniversaryReminder = signal(false);

  /** Texto del banner de recordatorio (dÃ­as disponibles + fecha de vencimiento). */
  anniversaryMessage = signal("");

  ngOnInit(): void {
    this.loadAvailableYearsAndBalance();
  }

  /**
   * ?? Carga los aÃ±os disponibles y luego el balance del AÃ±o seleccionado.
   *
   * Se secuencia correctamente: primero obtiene los aÃ±os del backend para validar
   * que `currentYear` sea un AÃ±o con datos. Si el AÃ±o en curso no estÃ³ disponible
   * (ej. empleado ingresÃ³ el AÃ±o pasado), carga el Ãºltimo AÃ±o disponible.
   *
   * **Importante:** `loadBalance()` se llama DespuÃ©s de validar `currentYear`
   * para evitar enviar un AÃ±o invÃ³lido al endpoint de balance.
   */
  async loadAvailableYearsAndBalance(): Promise<void> {
    try {
      const response = await this.apiResponseS.onGetList<
        { label: string; value: number }[]
      >(`my-vacation-requests/available-years`);

      if (response && response.length > 0) {
        this.availableYears = response;
        // Inteligencia de SelecciÃ³n:
        // Queremos seleccionar por defecto el aniversario cuyo AÃ±o de "Disfrute" coincide con el AÃ±o del calendario actual.
        // Como el Disfrute es (Generado + 1), buscamos el (CalendarYear - 1).
        const currentCalendarYear = new Date().getFullYear();
        const targetYear = currentCalendarYear - 1;

        const yearOption = this.availableYears.find(
          (y) => y.value === targetYear,
        );

        if (yearOption) {
          this.currentYearControl.setValue(yearOption.value, {
            emitEvent: false,
          });
        } else {
          // Si no existe (ej. es un empleado que acaba de entrar este mismo AÃ±o calendario),
          // seleccionamos el Ã³nico/ultimo AÃ±o disponible para que vea sus adelantos si aplica.
          this.currentYearControl.setValue(
            this.availableYears[this.availableYears.length - 1].value,
            { emitEvent: false },
          );
        }
      }
    } catch (error) {
      console.error("Error loading available years:", error);
    }

    // Carga el balance DespuÃ©s de validar currentYear.
    this.loadBalance();
  }

  /**
   * ? Carga el balance del periodo de aniversario seleccionado y el historial de solicitudes en paralelo.
   *
   * Usa `Promise.all` para lanzar ambas llamadas a la vez y esperar las dos.
   * Una vez recibidas, filtra las solicitudes para mostrar solo las que pertenecen
   * al periodo de aniversario del AÃ±o seleccionado (RN-002, RN-007).
   *
   * TambiÃ³n dispara `checkAnniversaryReminder` para evaluar si debe mostrarse
   * el banner de recordatorio (RN-012).
   */
  loadBalance(): void {
    this.loading.set(true);
    this.balance.set(null);
    this.requests.set([]);

    // Carga balance e historial en paralelo para el AÃ±o seleccionado.
    Promise.all([
      this.apiResponseS.onGetItem<VacationBalanceDTO>(
        `my-vacation-requests/my-balance?year=${this.currentYear}`,
      ),
      this.apiResponseS.onGetList<VacationRequestMyDTO[]>(
        `my-vacation-requests`,
      ),
    ])
      .then(([balanceData, allRequests]) => {
        this.balance.set(balanceData);
        this.checkAnniversaryReminder();

        // Filtra las solicitudes al periodo de aniversario correspondiente.
        // El backend devuelve TODAS las solicitudes; el filtrado es client-side (RN-007).
        if (balanceData && allRequests) {
          this.requests.set(
            this.filterRequestsByAnniversaryPeriod(allRequests, balanceData),
          );
        }

        this.loading.set(false);
      })
      .catch(() => this.loading.set(false));
  }

  /**
   * ??? Filtra las solicitudes para incluir solo las que caen dentro del periodo
   * de aniversario del AÃ±o seleccionado (RN-002).
   *
   * **CÃ³lculo del periodo:**
   * - Inicio: fecha de aniversario del empleado en el AÃ±o `balanceData.year`
   *   (ej. si ingresÃ³ el 17-Feb, inicio = 17-Feb-2025 para el periodo 2025).
   * - Fin: dÃ­a antes del siguiente aniversario (ej. 16-Feb-2026).
   *
   * Solo se compara `startDate` de la solicitud contra este rango.
   *
   * @param allRequests Todas las solicitudes del empleado (sin filtrar).
   * @param balanceData Balance del periodo seleccionado, que incluye `employeeAdmissionDate` y `year`.
   */
  private filterRequestsByAnniversaryPeriod(
    allRequests: VacationRequestMyDTO[],
    balanceData: VacationBalanceDTO,
  ): VacationRequestMyDTO[] {
    const admissionDate = new Date(balanceData.employeeAdmissionDate);
    const balanceYear = balanceData.year; // AÃ±o de inicio del periodo de aniversario.

    // Rango del periodo: desde el aniversario de ese AÃ±o hasta el dÃ­a previo al siguiente.
    const periodStart = new Date(
      balanceYear,
      admissionDate.getMonth(),
      admissionDate.getDate(),
    );
    const periodEnd = new Date(
      balanceYear + 1,
      admissionDate.getMonth(),
      admissionDate.getDate() - 1,
    );

    return allRequests.filter((req) => {
      const start = new Date(req.startDate);
      return start >= periodStart && start <= periodEnd;
    });
  }

  /**
   * ?? Manejador del selector de AÃ±o.
   * Al cambiar el AÃ±o, recarga el balance y el historial de solicitudes
   * para el nuevo periodo de aniversario seleccionado.
   */
  onYearChange(year: number): void {
    this.currentYearControl.setValue(year, { emitEvent: false });
    this.loadBalance();
  }

  /**
   * ??? Retorna la severidad de PrimeNG para el estado de una solicitud.
   * Delega al helper `statusSeverityFn` para mantener consistencia en toda la app.
   *
   * | Estado      | Severidad  | Color     |
   * |-------------|------------|-----------|
   * | Aprobada    | success    | Verde     |
   * | Rechazada   | danger     | Rojo      |
   * | Cancelada   | info       | Azul      |
   * | Pendiente   | warn       | Amarillo  |
   */
  onGetSeverity(status: string) {
    return statusSeverityFn(status);
  }

  /**
   * ?? EvalÃ³a si debe mostrarse el banner de recordatorio de vacaciones prÃ³ximas a vencer.
   *
   * **Condiciones para mostrar el banner (RN-012):**
   * 1. El empleado tiene dÃ­as de vacaciones disponibles (saldo > 0).
   * 2. La prÃ³xima fecha de aniversario cae dentro de los prÃ³ximos 2 meses.
   *
   * **Ventana de 2 meses:** Sincronizado con `NotifyExpiringVacationsJob` del backend.
   *
   * **CorrecciÃ³n de bug:** `nextAnniversary` se crea con `new Date()` para evitar
   * mutar `currentYearAnniversary` al llamar `setFullYear()`.
   */
  private checkAnniversaryReminder(): void {
    const balanceData = this.balance();
    if (!balanceData || balanceData.availableDays <= 0) {
      this.showAnniversaryReminder.set(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ventana de recordatorio: 2 meses desde hoy.
    // ?? Sincronizado con el Job del backend (RN-012).
    const twoMonthsFromNow = new Date(today);
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

    const admissionDate = new Date(balanceData.employeeAdmissionDate);
    const currentYearAnniversary = new Date(
      today.getFullYear(),
      admissionDate.getMonth(),
      admissionDate.getDate(),
    );

    // Calcula el prÃ³ximo aniversario sin mutar currentYearAnniversary.
    let nextAnniversary = new Date(currentYearAnniversary);
    if (currentYearAnniversary < today) {
      // El aniversario de este AÃ±o ya pasÃ³ ? el prÃ³ximo es el del AÃ±o que viene.
      nextAnniversary = new Date(currentYearAnniversary);
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    if (nextAnniversary > today && nextAnniversary <= twoMonthsFromNow) {
      // La fecha de aniversario estÃ³ dentro de los prÃ³ximos 2 meses ? mostrar recordatorio.
      this.anniversaryMessage.set(
        `Recuerda que tienes ${
          balanceData.availableDays
        } dÃ­a(s) de vacaciones pendientes. Debes tomarlos antes de tu fecha de aniversario (${nextAnniversary.toLocaleDateString()}) ya que no son acumulables.`,
      );
      this.showAnniversaryReminder.set(true);
    } else {
      this.showAnniversaryReminder.set(false);
    }
  }
}

