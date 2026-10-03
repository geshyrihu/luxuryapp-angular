import { FormControl } from "@angular/forms";

export interface EquipmentContentFormGroup {
  name: FormControl<string>;
  type: FormControl<number | null>;
  quantity: FormControl<number | null>;
  notes: FormControl<string>;
  photo: FormControl<string | File>;
  removePhoto: FormControl<boolean>;
}

export interface EquipmentContentsDialogData {
  equipmentId: string;
  equipmentName: string;
}

export interface EquipmentContentFormDialogData {
  id: string | null;
  equipmentId: string;
  title: string;
  currentPhoto?: string;
}
