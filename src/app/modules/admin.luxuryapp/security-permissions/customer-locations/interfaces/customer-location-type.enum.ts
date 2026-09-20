export enum CustomerLocationType {
  MainGate = 'MainGate',
  PedestrianGate = 'PedestrianGate',
  Lobby = 'Lobby',
  Reception = 'Reception',
  Office = 'Office',
}

export const CustomerLocationTypeLabels: Record<CustomerLocationType, string> = {
  [CustomerLocationType.MainGate]: 'Caseta Principal',
  [CustomerLocationType.PedestrianGate]: 'Caseta Peatonal',
  [CustomerLocationType.Lobby]: 'Lobby',
  [CustomerLocationType.Reception]: 'Recepción',
  [CustomerLocationType.Office]: 'Oficina',
};

export const CustomerLocationTypeOptions = Object.values(
  CustomerLocationType,
).map((type) => ({
  value: type,
  label: CustomerLocationTypeLabels[type],
}));
