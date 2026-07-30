export interface ComiteVigilancia {
  id: string;
  customerId: string;
  propertyMemberId: string;
  nameProperty: string;
  departamento: string;
  celular: string;
  email: string;
  posicionComite: string;
}

export interface ComiteVigilanciaEditData {
  customerId: string;
  propertyMemberId: string;
  propertyMemberName: string;
  posicionComite: string | number;
}

export interface CommitteeDirectoryCustomer {
  nombreCorto: string;
  numeroCliente: string;
}

export interface CommitteeDirectoryMember {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  posicionComite: string;
}

export interface CommitteeDirectoryGroup {
  customer: CommitteeDirectoryCustomer;
  committeeMembers: CommitteeDirectoryMember[];
}
