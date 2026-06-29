import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { FieldsetModule } from "primeng/fieldset";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { CustomerTaskItemConfig } from "src/app/core/models/recurring-tasks/customer-task-item-config.model";
import { TaskTemplate } from "src/app/core/models/recurring-tasks/task-template.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-customer-config",
  templateUrl: "./customer-config.html",
  imports: [
    FormsModule,
    CustomInputSelectSignal,
    FieldsetModule,
    CheckboxModule,
    CustomButtonSave,
  ],
})
export class CustomerConfig implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  customers = signal<ISelectItem[]>([]);
  selectedCustomerId = signal<string | null>(null);

  templates = signal<TaskTemplate[]>([]);
  selectedItems = signal(new Map<string, boolean>());
  submitting = signal(false);

  constructor() {
    // Effect to react to customer changes
    effect(() => {
      const customerId = this.selectedCustomerId();
      if (customerId) {
        this.loadTemplates();
        this.loadCustomerConfig(customerId);
      } else {
        this.templates.set([]);
        this.selectedItems.set(new Map());
      }
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  async loadCustomers() {
    const response = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.customersActive,
    );
    this.customers.set(response || []);
  }

  async loadTemplates() {
    const response = await this.apiResponseS.onGetList<TaskTemplate[]>(
      Endpoints.RecurringTasks.Templates.getActiveList,
    );
    this.templates.set(response || []);
  }

  async loadCustomerConfig(customerId: string) {
    const response = await this.apiResponseS.onGetItem<CustomerTaskItemConfig>(
      Endpoints.RecurringTasks.Templates.customerConfig(customerId),
    );
    const newSelectedItems = new Map<string, boolean>();
    if (response && response.enabledTaskItemIds) {
      response.enabledTaskItemIds.forEach((id: string) => {
        newSelectedItems.set(id, true);
      });
    }
    this.selectedItems.set(newSelectedItems);
  }

  async onSave() {
    const customerId = this.selectedCustomerId();
    if (!customerId) return;

    const enabledTaskItemIds = Array.from(this.selectedItems().keys()).filter(
      (id) => this.selectedItems().get(id),
    );

    const config: CustomerTaskItemConfig = {
      customerId: customerId,
      enabledTaskItemIds: enabledTaskItemIds,
    };

    await FormHelper.submitCrud({
      form: new FormGroup({}),
      api: this.apiResponseS,
      endpoint: Endpoints.RecurringTasks.Templates.saveCustomerConfig,
      method: "POST",
      submitting: this.submitting,
      transformPayload: () => config,
      closeOnSuccess: false,
    });
  }

  onItemCheckChange(itemId: string, isChecked: boolean) {
    this.selectedItems.update((currentMap) => {
      const newMap = new Map(currentMap);
      newMap.set(itemId, isChecked);
      return newMap;
    });
  }
}
