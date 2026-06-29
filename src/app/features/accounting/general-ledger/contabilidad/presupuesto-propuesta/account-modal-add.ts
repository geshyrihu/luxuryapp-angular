/**
 * ============================================================================
 * âš ï¸ ADVERTENCIA CRÃTICA / CRITICAL WARNING âš ï¸
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100% 
 * FUNCIONAL y ESTABLE. 
 * 
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lógica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explícita del Ing. Ricardo Marques.
 * 
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { RippleModule } from "primeng/ripple";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomButton } from "src/app/core/components/web/buttons";
import { IAvailableAccountDTO } from "./models/IAvailableAccountDto";

interface ISearchForm {
  searchTerm: FormControl<string>;
}

@Component({
  selector: "app-account-modal-add",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButton,
    MessageModule,
    RippleModule,
  ],
  templateUrl: "./account-modal-add.html",
})
export class AccountModalAdd implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  loading = signal(true);
  availableAccounts = signal<IAvailableAccountDTO[]>([]);
  filteredAccounts = signal<IAvailableAccountDTO[]>([]);
  selectedAccounts = signal<string[]>([]); // Para selección móltiple
  errorMensaje: string | null = null;

  customerId: string = this.config.data.customerId;
  fiscalYear: number = this.config.data.fiscalYear;
  proposalId: string = this.config.data.proposalId;

  // Definición estricta del formulario
  searchForm = new FormGroup<ISearchForm>({
    searchTerm: new FormControl<string>("", { nonNullable: true }),
  });

  searchTermSignal = toSignal(this.searchForm.controls.searchTerm.valueChanges);

  constructor() {
    effect(() => {
      const term = this.searchTermSignal();
      this.filterAccounts(term || null);
    });
  }

  ngOnInit(): void {
    this.loadAvailableAccounts();
    // valueChanges logic moved to effect
  }

  loadAvailableAccounts(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<
        IAvailableAccountDTO[]
      >(`BudgetProposal/available-accounts/${this.customerId}/${this.fiscalYear}/${this.proposalId}`)
      .then((response) => {
        if (response) {
          this.availableAccounts.set(response || []);
          this.filteredAccounts.set(response || []);
        } else {
          this.errorMensaje = "No se encontraron cuentas disponibles.";
          this.availableAccounts.set([]);
          this.filteredAccounts.set([]);
        }
        this.loading.set(false);
      });
  }

  filterAccounts(searchTerm: string | null): void {
    if (!searchTerm) {
      this.filteredAccounts.set(this.availableAccounts());
      return;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    this.filteredAccounts.set(
      this.availableAccounts().filter(
        (account) =>
          account.codigoCuenta.toLowerCase().includes(lowerCaseTerm) ||
          account.descripcionCuenta.toLowerCase().includes(lowerCaseTerm),
      ),
    );
  }

  toggleAccountSelection(accountNumber: string): void {
    this.selectedAccounts.update((currentSelection) => {
      if (currentSelection.includes(accountNumber)) {
        return currentSelection.filter((acc) => acc !== accountNumber);
      } else {
        return [...currentSelection, accountNumber];
      }
    });
  }

  isSelected(accountNumber: string): boolean {
    return this.selectedAccounts().includes(accountNumber);
  }

  submitSelectedAccounts(): void {
    if (this.selectedAccounts().length === 0) {
      this.errorMensaje = "Por favor, selecciona al menos una cuenta.";
      return;
    }
    this.ref.close(this.selectedAccounts());
  }

  closeDialog(): void {
    this.ref.close();
  }
}

