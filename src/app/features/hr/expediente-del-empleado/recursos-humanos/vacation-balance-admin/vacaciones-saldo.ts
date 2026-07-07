import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
// Alias para evitar colisión de nombres con el mótodo de instancia onGetSeverity.
import { getStatusSeverity as statusSeverityFn } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/helpers/status-severity.helper";
import { VacationBalanceDTO } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/interfaces/vacation-balance.interface";
import { VacationRequestMyDTO as VacationRequestHistoryDTO } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/interfaces/vacation-request.interface";

/**
 * DTO local para representar una solicitud de vacaciones del empleado.
 * Refleja los campos que devuelve el endpoint GET /my-vacation-requests.
 * Se define aquó para mantener el componente autónomo sin importar
 * un módulo externo de interfaces adicional.
 */
export interface VacationRequestMyDTO extends VacationRequestHistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  /** Días hóbiles solicitados ó calculados en tiempo real en el backend (RN-005). */
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
 * - Mostrar el balance de días (totales, usados, pendientes, disponibles) para el periodo de aniversario seleccionado.
 * - Permitir navegar entre periodos de aniversario históricos mediante un selector de Año.
 * - Mostrar el historial de solicitudes filtrado por el periodo de aniversario seleccionado.
 * - Mostrar un banner de recordatorio cuando el aniversario estó próximo y hay días disponibles (RN-012).
 *
 * **Flujo de carga:**
 * 1. `ngOnInit` ? `loadAvailableYearsAndBalance()`
 * 2. Primero carga los años disponibles (`/available-years`) para validar que `currentYear` sea vólido.
 * 3. Luego llama a `loadBalance()` que lanza en paralelo:
 *    - `/my-balance?year=X` ? obtiene el balance del periodo seleccionado (RN-010).
 *    - `/my-vacation-requests` ? obtiene todas las solicitudes del empleado.
 * 4. Las solicitudes se filtran client-side por el rango del periodo de aniversario (RN-002, RN-007).
 */
@Component({
  selector: "app-vacaciones-saldo",
  templateUrl: "./vacaciones-saldo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
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

  /** Año de inicio del periodo de aniversario actualmente seleccionado. Inicialmente el Año en curso. */
  currentYearControl = new FormControl<number>(new Date().getFullYear());
  get currentYear() {
    return this.currentYearControl.value!;
  }

  /** Lista de años disponibles para el selector ó desde el Año de ingreso hasta el Año actual. */
  availableYears: { label: string; value: number }[] = [];

  /** Controla si se muestra el banner de recordatorio de vacaciones próximas a vencer. */
  showAnniversaryReminder = signal(false);

  /** Texto del banner de recordatorio (días disponibles + fecha de vencimiento). */
  anniversaryMessage = signal("");

  ngOnInit(): void {
    this.loadAvailableYearsAndBalance();
  }

  /**
   * ?? Carga los años disponibles y luego el balance del Año seleccionado.
   *
   * Se secuencia correctamente: primero obtiene los años del backend para validar
   * que `currentYear` sea un Año con datos. Si el Año en curso no estó disponible
   * (ej. empleado ingresó el Año pasado), carga el último Año disponible.
   *
   * **Importante:** `loadBalance()` se llama Después de validar `currentYear`
   * para evitar enviar un Año invólido al endpoint de balance.
   */
  async loadAvailableYearsAndBalance(): Promise<void> {
    try {
      const response = await this.apiResponseS.onGetList<
        { label: string; value: number }[]
      >(Endpoints.HR.VacationRequest.availableYears);

      if (response && response.length > 0) {
        this.availableYears = response;
        // Inteligencia de Selección:
        // Queremos seleccionar por defecto el aniversario cuyo Año de "Disfrute" coincide con el Año del calendario actual.
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
          // Si no existe (ej. es un empleado que acaba de entrar este mismo Año calendario),
          // seleccionamos el ónico/ultimo Año disponible para que vea sus adelantos si aplica.
          this.currentYearControl.setValue(
            this.availableYears[this.availableYears.length - 1].value,
            { emitEvent: false },
          );
        }
      }
    } catch (error) {
      console.error("Error loading available years:", error);
    }

    // Carga el balance Después de validar currentYear.
    this.loadBalance();
  }

  /**
   * ? Carga el balance del periodo de aniversario seleccionado y el historial de solicitudes en paralelo.
   *
   * Usa `Promise.all` para lanzar ambas llamadas a la vez y esperar las dos.
   * Una vez recibidas, filtra las solicitudes para mostrar solo las que pertenecen
   * al periodo de aniversario del Año seleccionado (RN-002, RN-007).
   *
   * Tambión dispara `checkAnniversaryReminder` para evaluar si debe mostrarse
   * el banner de recordatorio (RN-012).
   */
  loadBalance(): void {
    this.loading.set(true);
    this.balance.set(null);
    this.requests.set([]);

    // Carga balance e historial en paralelo para el Año seleccionado.
    Promise.all([
      this.apiResponseS.onGetItem<VacationBalanceDTO>(
        Endpoints.HR.VacationRequest.getBalanceByYear(this.currentYear),
      ),
      this.apiResponseS.onGetList<VacationRequestMyDTO[]>(
        Endpoints.HR.VacationRequest.getAll,
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
   * de aniversario del Año seleccionado (RN-002).
   *
   * **Cólculo del periodo:**
   * - Inicio: fecha de aniversario del empleado en el Año `balanceData.year`
   *   (ej. si ingresó el 17-Feb, inicio = 17-Feb-2025 para el periodo 2025).
   * - Fin: día antes del siguiente aniversario (ej. 16-Feb-2026).
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
    const balanceYear = balanceData.year; // Año de inicio del periodo de aniversario.

    // Rango del periodo: desde el aniversario de ese Año hasta el día previo al siguiente.
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
   * ?? Manejador del selector de Año.
   * Al cambiar el Año, recarga el balance y el historial de solicitudes
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
   * ?? Evalía si debe mostrarse el banner de recordatorio de vacaciones próximas a vencer.
   *
   * **Condiciones para mostrar el banner (RN-012):**
   * 1. El empleado tiene días de vacaciones disponibles (saldo > 0).
   * 2. La próxima fecha de aniversario cae dentro de los próximos 2 meses.
   *
   * **Ventana de 2 meses:** Sincronizado con `NotifyExpiringVacationsJob` del backend.
   *
   * **Corrección de bug:** `nextAnniversary` se crea con `new Date()` para evitar
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

    // Calcula el próximo aniversario sin mutar currentYearAnniversary.
    let nextAnniversary = new Date(currentYearAnniversary);
    if (currentYearAnniversary < today) {
      // El aniversario de este Año ya pasó ? el próximo es el del Año que viene.
      nextAnniversary = new Date(currentYearAnniversary);
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    if (nextAnniversary > today && nextAnniversary <= twoMonthsFromNow) {
      // La fecha de aniversario estó dentro de los próximos 2 meses ? mostrar recordatorio.
      this.anniversaryMessage.set(
        `Recuerda que tienes ${
          balanceData.availableDays
        } día(s) de vacaciones pendientes. Debes tomarlos antes de tu fecha de aniversario (${nextAnniversary.toLocaleDateString()}) ya que no son acumulables.`,
      );
      this.showAnniversaryReminder.set(true);
    } else {
      this.showAnniversaryReminder.set(false);
    }
  }
}
