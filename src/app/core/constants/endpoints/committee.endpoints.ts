export const EndpointsCommittee = {
  Committee: {
    BoardDirectors: {
      financialReportsByCustomer: (customerId: string) =>
        `committee/board-directors/financial-reports/${customerId}`,
      meetingMinuteDetailById: (meetingMinuteId: string | number) =>
        `committee/board-directors/meeting-minutes-detail/${meetingMinuteId}`,
      meetingMinutesByCustomer: (customerId: string) =>
        `committee/board-directors/meeting-minutes/${customerId}`,
      monthlyMeetingsByCustomer: (customerId: string) =>
        `committee/board-directors/monthly-meetings/${customerId}`,
    },
    Cobranza: {
      morosos: (customerId: string) => 
        `committee/cobranza/morosos?customerId=${customerId}`,
      morosoDetalle: (customerId: string, numCta: string) => 
        `committee/cobranza/morosos/${numCta}/detalle?customerId=${customerId}`,
    },
    Home: {
      images: "committee/home-images",
    },
    Library: {
      buildingInsurance: (customerId: string) =>
        `committee/library/building-insurance/${customerId}`,
      customDocumentsByType: (customerId: string, documentType: number) =>
        `committee/library/custom-documents/${customerId}/${documentType}`,
      policyContracts: (customerId: string, isCurrent: boolean) =>
        `committee/library/policy-contracts/${customerId}/${isCurrent}`,
    },
    Directorio: {
      byCustomer: (customerId: string) =>
        `committee/directorio/${customerId}`,
    },
  },
} as const;
