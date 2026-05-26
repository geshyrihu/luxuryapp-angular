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
  lecturaMedidorInicial: number;
  lecturaMedidorFinal: number;
  costoMetroCubico: number;
  colaboradorMttoId: string | null;
  colaboradorMtto: string | null;
  guardiaSeguridad: string | null;
  fotoPipaLlenaUrl: string;
  fotoPipaVaciaUrl: string;
  fotoIneChoferUrl: string;
  fotoPlacasUrl: string;
  fotoMedidorAntesUrl: string;
  fotoMedidorDespuesUrl: string;
  fotoNivelAntesUrl: string;
  fotoNivelDespuesUrl: string;
  fotoNotaUrl: string;
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
  lecturaMedidorInicial: FormControl<number | null>;
  lecturaMedidorFinal: FormControl<number | null>;
  costoMetroCubico: FormControl<number | null>;
  colaboradorMttoId: FormControl<string | null>;
  colaboradorMtto: FormControl<string | null>;
  guardiaSeguridad: FormControl<string | null>;
  fotoPipaLlena: FormControl<string | File>;
  fotoPipaVacia: FormControl<string | File>;
  fotoIneChofer: FormControl<string | File>;
  fotoPlacas: FormControl<string | File>;
  fotoMedidorAntes: FormControl<string | File>;
  fotoMedidorDespues: FormControl<string | File>;
  fotoNivelAntes: FormControl<string | File>;
  fotoNivelDespues: FormControl<string | File>;
  fotoNota: FormControl<string | File>;
}
