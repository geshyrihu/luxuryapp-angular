import { Component, inject, input, OnInit, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { callOutline, peopleOutline } from "ionicons/icons";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { EmployeeAddOrEditService } from './employee-form.service';
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonConfirm } from "src/app/core/components/buttons/web/custom-button-confirm";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { EmployeeEmergencyContactForm } from "./employee-emergency-contact-form";
@Component({
  selector: "employee-emergency-contact-list",
  templateUrl: "./employee-emergency-contact-list.html",
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    PrimeNgCustomCaption,
    CustomButton,
    CustomButtonConfirm,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class EmployeeEmergencyContactList implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);

  constructor() {
    addIcons({ callOutline, peopleOutline });
  }

  employeeId = input<any>(0);

  id: string = "";
  contactEmployeeAdd: any;

  dataEmergencyContact: any = [];
  globalFilterFields: string[] = [];
  loading = signal(true);
  dataBeneficiary: any = [];
  ngOnInit() {
    if (this.employeeId() !== 0 && this.employeeId() !== undefined) {
      this.onLoadDataEmergencyContact();
      this.onLoadDataBeneficiary();
    }
  }

  onLoadDataEmergencyContact() {
    const urlApi = `EmployeeEmergencyContact/ListEmployeeContact/${this.employeeId()}/${0}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.dataEmergencyContact = result;

      this.globalFilterFields = globalFilterFields(result);
    });
  }
  onLoadDataBeneficiary() {
    const urlApi = `EmployeeEmergencyContact/ListEmployeeContact/${this.employeeId()}/${1}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.dataBeneficiary = result;
    });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        EmployeeEmergencyContactForm,
        data,
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
      .onDelete(`EmployeeEmergencyContact/${id}`)
      .then((result: any) => {
        if (result) {
          if (typeContact === 0) {
            this.dataEmergencyContact = this.dataEmergencyContact.filter(
              (item) => item.id !== id,
            );
          }
          if (typeContact === 1) {
            this.dataBeneficiary = this.dataBeneficiary.filter(
              (item) => item.id !== id,
            );
          }
        }
      });
  }
}









