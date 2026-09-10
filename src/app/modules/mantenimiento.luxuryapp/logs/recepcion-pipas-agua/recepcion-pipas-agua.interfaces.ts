import { FormControl } from "@angular/forms";

export interface IRecepcionPipaAgua {
  id: string;
  customerId: string;
  horaLlegada: string;
  horaTermino: string | null;
  placasCamion: string;
  empresa: string | null;
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
  empresa: FormControl<string | null>;
  colaboradorMttoId: FormControl<string | null>;
  colaboradorMtto: FormControl<string | null>;
  guardiaSeguridad: FormControl<string | null>;
  fotoPipaLlena: FormControl<string | File | null>;
  fotoPipaVacia: FormControl<string | File | null>;
  fotoIneChofer: FormControl<string | File | null>;
  fotoPlacas: FormControl<string | File | null>;
  fotoMedidorAntes: FormControl<string | File | null>;
  fotoMedidorDespues: FormControl<string | File | null>;
  fotoNivelAntes: FormControl<string | File | null>;
  fotoNivelDespues: FormControl<string | File | null>;
  fotoNota: FormControl<string | File | null>;
}
