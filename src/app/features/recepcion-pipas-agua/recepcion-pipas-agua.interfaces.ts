import { FormControl } from "@angular/forms";

export interface IRecepcionPipaAgua {
  id: string;
  customerId: string;
  horaLlegada: string;
  horaTermino: string | null;
  placasCamion: string;
  capacidadPipa: number;
  nivelCisternaAntes: number;
  nivelCisternaDespues: number;
  lecturaMetroAntes: number;
  lecturaMetroDespues: number;
  fotoPipaLlenaUrl: string;
  fotoPipaVaciaUrl: string;
  fotoIneChoferUrl: string;
  createdAt: string;
}

export interface IRecepcionPipaAguaForm {
  customerId: FormControl<string | null>;
  horaLlegada: FormControl<string>;
  horaTermino: FormControl<string | null>;
  placasCamion: FormControl<string>;
  capacidadPipa: FormControl<number | null>;
  nivelCisternaAntes: FormControl<number | null>;
  nivelCisternaDespues: FormControl<number | null>;
  lecturaMetroAntes: FormControl<number | null>;
  lecturaMetroDespues: FormControl<number | null>;
  fotoPipaLlena: FormControl<string | File>;
  fotoPipaVacia: FormControl<string | File>;
  fotoIneChofer: FormControl<string | File>;
}
