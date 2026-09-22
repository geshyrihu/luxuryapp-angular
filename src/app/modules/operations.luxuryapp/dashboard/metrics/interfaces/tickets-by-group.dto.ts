export interface TicketsByGroupDTO {
  month: number;
  year: number;
  monthName: string;
  items: TicketsGroupItemDTO[];
}

export interface TicketsGroupItemDTO {
  groupId: string;
  group: string;
  pending: number;
  completed: number;
  total: number;
  pastPending: number;
}
