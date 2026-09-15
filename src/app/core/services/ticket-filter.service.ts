import { Injectable, inject } from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { FilterTicket } from "@core/interfaces/filter-ticket.interface";
@Injectable({
  providedIn: "root",
})
export class TicketFilterService {
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  filterTicket: FilterTicket = {
    customer: this.customerIdS.customerId(),
    status: 0,
    responsible: "",
    request: "",
    requestStart: "",
    finishedStart: "",
    requestEnd: "",
    finishedEnd: "",
    priority: "",
    folioReporte: null,
  };

  setIdCustomer(customerId: string) {
    this.filterTicket.customer = customerId;
  }
  setStateDenegade() {
    this.filterTicket.status = 2;
  }
  getIdCustomer() {
    return this.filterTicket.customer;
  }
  get getfilterTicket() {
    return this.filterTicket;
  }
  setfilterTicket(filterTicket: FilterTicket) {
    this.filterTicket = filterTicket;
  }
}

