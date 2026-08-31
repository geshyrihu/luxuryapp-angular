export interface OnboardingChecklistOptionDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  diasSla: number;
  roles: Array<number | string>;
}

export interface OnboardingChecklistOptionAddOrEdit {
  name: string;
  description: string;
  isActive: boolean;
  diasSla: number;
  roles: number[];
}
