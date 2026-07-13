import { VisitDto } from "./visit.dto";

export interface OccupancyDto {
  currentInside: number;
  visits: VisitDto[];
}
