import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { callOutline, peopleOutline } from "ionicons/icons";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { EmployeeAddOrEditService } from './employee-form.service';
import { CommonModule } from "@angular/common";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EmployeeEmergencyContactForm } from "./employee-emergency-contact-form";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "employee-emergency-contact-list",
  templateUrl: "./employee-emergency-contact-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconConfirm,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,

    DataViewMobile,
    IonItem,
    IonLabel,
  ],
})
export class EmployeeEmergencyContactList implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);

  constructor() {
    addIcons({ callOutline, peopleOutline });
  }

  employeeId = input<any>(0);

  dataEmergencyContact = signal<any[]>([]);
  dataBeneficiary = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataEmergencyContact();
    return data.length > 0 ? globalFilterFields(data) : [];
  });
  loading = signal(true);
  ngOnInit() {
    if (this.employeeId() !== 0 && this.employeeId() !== undefined) {
      this.onLoadDataEmergencyContact();
      this.onLoadDataBeneficiary();
    }
  }

  onLoadDataEmergencyContact() {
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeEmergencyContact.listEmployeeContact(
          this.employeeId(),
          0,
        ),
      )
      .then((result: any) => {
        this.dataEmergencyContact.set(result ?? []);
      });
  }

  onLoadDataBeneficiary() {
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeEmergencyContact.listEmployeeContact(
          this.employeeId(),
          1,
        ),
      )
      .then((result: any) => {
        this.dataBeneficiary.set(result ?? []);
      });
  }

  onModalForm(data: {
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeEmergencyContactForm,
        {
          id: data.id,
          title: data.title,
          contacOfBeneficiary: data.contacOfBeneficiary,
          employeeId: this.employeeId(),
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadDataBeneficiary();
          this.onLoadDataEmergencyContact();
        }
      });
  }

  onDelete(id: string, typeContact: number) {
    this.apiResponseS
      .onDelete(Endpoints.EmployeeEmergencyContact.delete(id))
      .then((result: any) => {
        if (result) {
          if (typeContact === 0) {
            this.dataEmergencyContact.update((data) =>
              data.filter((item: any) => item.id !== id),
            );
          }
          if (typeContact === 1) {
            this.dataBeneficiary.update((data) =>
              data.filter((item: any) => item.id !== id),
            );
          }
        }
      });
  }
}
