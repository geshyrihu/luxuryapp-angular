import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";

import {
  ApprovalConfirmationResult,
  ApprovalPanelRequest,
  LeaveHistorySummaryDTO,
  OverlappingApprovalRequestDTO,
} from "../interfaces/approval.interface";
import { EPaidStatus } from "../interfaces/leave-request.interface";
import { VacationBalanceDTO } from "../interfaces/vacation-balance.interface";
import { ApprovalInfoService } from "./approval-info.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-approval-confirmation-modal",
  imports: [
    ApiDatePipe,
    ReactiveFormsModule,
    LxSpinner,
    WebButtonLabel,
    LxDivider,
    LxMessage,
    LxTag,
    CustomInputToggleSwitch,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (loading) {
      <div class="flex justify-center items-center p-5">
        <lx-spinner [strokeWidth]="6" [ariaLabel]="'loading'"></lx-spinner>
      </div>
    } @else {
      <div class="p-fluid p-3">
        <div class="mb-4 text-center">
          <h4 class="mb-1">{{ request.employeeFullName }}</h4>
          <lx-tag [value]="request.requestType" [rounded]="true"></lx-tag>
        </div>

        @if (request.requestType === "Permiso") {
          <div class="mb-4 text-center">
            <div
              class="flex items-center justify-center p-3 rounded"
              [class.bg-green-100]="paidStatus.value"
              [class.text-green-800]="paidStatus.value"
              [class.bg-yellow-100]="!paidStatus.value"
              [class.text-yellow-800]="!paidStatus.value"
            >
              <custom-input-toggle-switch-signal
                [control]="paidStatus"
                [onlyInput]="true"
                [noMargin]="true"
              />
              <label class="font-bold">
                {{
                  paidStatus.value ? "CON GOCE DE SUELDO" : "SIN GOCE DE SUELDO"
                }}
              </label>
            </div>
          </div>
        }

        @if (request.requestType === "Permiso") {
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <app-icon [icon]="'material-symbols-light:history'" class="text-xl" />
              <h5 class="mb-0 font-semibold">Historial (óltimos 3 meses)</h5>
            </div>
            <p class="text-600">
              El empleado ha solicitado
              <lx-tag
                [value]="leaveHistory?.recentRequests ?? 0"
                severity="info"
              />
              permisos.
            </p>
          </div>
        }

        @if (request.requestType === "Vacaciones") {
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <app-icon [icon]="'material-symbols-light:sunny'" class="text-xl" />
              <h5 class="mb-0 font-semibold">Saldo de Vacaciones</h5>
            </div>
            <p class="text-600">
              Días disponibles:
              <lx-tag
                [value]="vacationBalance?.availableDays ?? 0"
                severity="success"
              />
            </p>
          </div>
        }

        <lx-divider />

        <div class="mt-4">
          <div class="flex items-center mb-3">
            <app-icon
              [icon]="'material-symbols-light:group'"
              class="text-xl text-orange-500"
            />
            <h5 class="mb-0 font-semibold text-orange-500">
              Posible Solapamiento de Fechas
            </h5>
          </div>

          @if (request.requestType === "Permiso") {
            @if (overlappingLeaveRequests.length > 0) {
              <div class="surface-100 rounded p-3">
                <ul class="m-0 p-0 list-none">
                  @for (req of overlappingLeaveRequests; track req.id) {
                    <li class="flex items-center justify-between p-2">
                      <span>
                        <app-icon
                          [icon]="'material-symbols-light:person'"
                          class="mr-2 text-gray-600"
                        />
                        {{ req.fullName }}
                      </span>
                      <lx-tag
                        [value]="
                          (req.startDate | apiDate: 'dd MMM') +
                          ' - ' +
                          (req.endDate | apiDate: 'dd MMM')
                        "
                        severity="warning"
                      />
                    </li>
                  }
                </ul>
              </div>
            } @else {
              <lx-message
                severity="info"
                text="No hay otras solicitudes de permiso que se solapen en estas fechas."
              />
            }
          }

          @if (request.requestType === "Vacaciones") {
            @if (overlappingVacationRequests.length > 0) {
              <div class="surface-100 rounded p-3">
                <ul class="m-0 p-0 list-none">
                  @for (req of overlappingVacationRequests; track req.id) {
                    <li class="flex items-center justify-between p-2">
                      <span>
                        <app-icon
                          [icon]="'material-symbols-light:person'"
                          class="mr-2 text-gray-600"
                        />
                        {{ req.fullName }}
                      </span>
                      <lx-tag
                        [value]="
                          (req.startDate | apiDate: 'dd MMM') +
                          ' - ' +
                          (req.endDate | apiDate: 'dd MMM')
                        "
                        severity="warning"
                      />
                    </li>
                  }
                </ul>
              </div>
            } @else {
              <lx-message
                severity="info"
                text="No hay otras solicitudes de vacaciones que se solapen en estas fechas."
              />
            }
          }
        </div>

        <div class="flex justify-end mt-5">
          <il-button
            (clicked)="ref.close(false)"
            label="Cancelar"
            variant="text"
            severity="secondary"
          />
          <il-button
            (clicked)="onApprove()"
            label="Aprobar Solicitud"
            iconClass="material-symbols-light:check"
            [loading]="submitting"
          />
        </div>
      </div>
    }
  `,
})
export class ApprovalConfirmationModal implements OnInit {
  private approvalInfoService = inject(ApprovalInfoService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private cdr = inject(ChangeDetectorRef);

  request: ApprovalPanelRequest = this.config.data.request;
  loading = true;
  submitting = false;
  paidStatus = new FormControl<boolean>(false, { nonNullable: true });

  leaveHistory: LeaveHistorySummaryDTO | null = null;
  overlappingLeaveRequests: OverlappingApprovalRequestDTO[] = [];
  vacationBalance: VacationBalanceDTO | null = null;
  overlappingVacationRequests: OverlappingApprovalRequestDTO[] = [];

  async ngOnInit() {
    this.loading = true;

    try {
      if (this.request.requestType === "Permiso") {
        const [historyResult, overlappingResult] = await Promise.all([
          this.approvalInfoService.getLeaveRequestHistorySummary(
            this.request.employeeId,
          ),
          this.approvalInfoService.getOverlappingLeaveRequests(
            this.request.customerId,
            this.request.startDate,
            this.request.endDate,
            this.request.employeeId,
          ),
        ]);

        this.leaveHistory = historyResult;
        this.overlappingLeaveRequests = overlappingResult ?? [];
      } else {
        const [balanceResult, overlappingResult] = await Promise.all([
          this.approvalInfoService.getVacationBalance(this.request.employeeId),
          this.approvalInfoService.getOverlappingVacationRequests(
            this.request.customerId,
            this.request.startDate,
            this.request.endDate,
            this.request.employeeId,
          ),
        ]);

        this.vacationBalance = balanceResult;
        this.overlappingVacationRequests = overlappingResult ?? [];
      }
    } catch (error) {
      console.error("Error fetching approval info:", error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onApprove(): void {
    const result: ApprovalConfirmationResult = {
      approved: true,
      paidStatus: this.paidStatus.value
        ? EPaidStatus.ConGozedeSueldo
        : EPaidStatus.SinGozedeSueldo,
    };

    this.ref.close(result);
  }
}
