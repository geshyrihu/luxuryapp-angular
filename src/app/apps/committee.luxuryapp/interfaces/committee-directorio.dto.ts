export interface CommitteeDirectorioScheduleDay {
  day: string;
  entry: string;
  exit: string;
}

export interface CommitteeDirectorioDTO {
  photoPath: string | null;
  firstName: string | null;
  lastName: string | null;
  roleName: string | null;
  phoneNumber: string | null;
  email: string | null;
  sortOrder: number;
  groupName: string | null;
  /** true = en turno, false = fuera de turno, null = sin horario definido. */
  isOnShift: boolean | null;
  /** Horario semanal (solo días que trabaja). */
  schedule: CommitteeDirectorioScheduleDay[] | null;
}
