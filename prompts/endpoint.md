# Guía para Centralizar Endpoints en un Solo Archivo

> **Fase 1**: Crear el archivo de endpoints con las rutas actuales (sin modificar)
> **Fase 2**: Refactorizar componentes para usar los endpoints centralizados

## Objetivo

Crear un archivo único y centralizado donde se definan todos los endpoints de la aplicación. Esto permitirá:

- Unificar y mantener en un solo lugar todas las rutas de la API
- Facilitar futuras refactorizaciones
- Evitar duplicación y errores de escritura en las URLs
- Estandarizar el naming de los endpoints

> **Importante**: En esta primera fase, los endpoints deben reflejar exactamente las rutas actuales hardcodeadas. La migración de los componentes se realizará en una segunda fase.

> **Importante**: En esta primera fase, los endpoints deben reflejar exactamente las rutas actuales hardcodeadas. La migración de los componentes se realizará en una segunda fase.

## Estructura del Archivo de Endpoints

El archivo debe estar ubicado en: `src/app/core/constants/endpoints.ts`

### Patrón de Definición - Fase 1

```typescript
/**
 * Endpoints centralizados de la aplicación
 * Fase 1: Definición exacta de las rutas actuales (sin modificarlas)
 * Fase 2: Migración de componentes para usar estos endpoints
 */
export const Endpoints = {
  // Módulo Banks (Payment) - Rutas actuales sin cambios
  Banks: {
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    create: "Banks", // IMPORTANTE: mantener exactamente como está (mayúscula inicial)
    update: (id: string) => `Banks/${id}`, // IMPORTANTE: mantener exactamente como está
    delete: (id: string) => `banks/${id}`,
    selectItems: "select-items/banks",
  },

  // Otros módulos...
} as const;
```

### Reglas de Fase 1

1. **Copiar exactamente**: Las URLs deben ser idénticas a las actuales (mayúsculas, minúsculas, guiones)
2. **No normalizar**: Aunque `Banks` y `banks` técnicamente podrían ser lo mismo, mantener la versión actual
3. **Documentar cambios futuros**: Agregar comentarios para indicar qué debería cambiarse en Fase 2
4. **Crear estructura vacía**: Para módulos que aún no existen, crear la estructura con valores temporal

### Convenciones

1. **Naming**: Usar PascalCase para el nombre del módulo (ej: `Banks`, `Customers`)
2. **Propiedades**: Usar camelCase para las acciones (ej: `getAll`, `getById`, `create`, `update`, `delete`)
3. **URLs**: Usar kebab-case minúsculas para las rutas (ej: `banks`, no `Banks`)
4. **Funciones flecha**: Para endpoints con parámetros dinámicos usar funciones que retornen la URL interpolada

## Uso en Componentes

### Incorrecto (Hardcoded)

```typescript
// En bank-list.ts
const urlApi = `banks`;
this.apiResponseS.onGetList(urlApi);

// En bank-form.ts
this.apiResponseS.onPost(`Banks`, this.form.value);
this.apiResponseS.onPut(`Banks/${this.id}`, this.form.value);
```

### Correcto (Usando Endpoints Centralizados)

```typescript
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

// En bank-list.ts
this.apiResponseS.onGetList(Endpoints.Banks.getAll);

// En bank-form.ts
this.apiResponseS.onPost(Endpoints.Banks.create, this.form.value);
this.apiResponseS.onPut(Endpoints.Banks.update(this.id), this.form.value);
```

## Métodos del ApiResponseService

| Método                               | Uso                         | Retorno                              |
| ------------------------------------ | --------------------------- | ------------------------------------ |
| `onGetList<T>(urlApi, httpParams?)`  | Obtener lista de recursos   | `Promise<T \| null>`                 |
| `onGetItem<T>(urlApi)`               | Obtener un recurso por ID   | `Promise<T \| null>`                 |
| `onGetPaged<T>(urlApi, httpParams?)` | Obtener recursos paginados  | `Promise<ApiResponseDTO<T> \| null>` |
| `onPost<T>(urlApi, data)`            | Crear nuevo recurso         | `Promise<T \| false>`                |
| `onPostPaged<T>(urlApi, data)`       | POST con paginación         | `Promise<ApiResponseDTO<T> \| null>` |
| `onPut<T>(urlApi, data)`             | Actualizar recurso completo | `Promise<T \| false>`                |
| `onPatch<T>(urlApi, data)`           | Actualizar parcialmente     | `Promise<T \| false>`                |
| `onDelete(urlApi)`                   | Eliminar recurso            | `Promise<boolean>`                   |
| `onGetSelectItem<T>(urlApi)`         | Obtener items para select   | `Promise<T \| null>`                 |
| `onGetEnumSelectItem<T>(urlApi)`     | Obtener enums para select   | `Promise<T \| null>`                 |

## Ejemplo Completo de Implementación

### Endpoints (src/app/core/constants/endpoints.ts)

```typescript
export const Endpoints = {
  Banks: {
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    create: "banks",
    update: (id: string) => `banks/${id}`,
    delete: (id: string) => `banks/${id}`,
    selectItems: "select-items/banks",
  },
} as const;
```

### bank-list.ts

```typescript
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints";

@Component({
  selector: "app-bank-list",
  templateUrl: "./bank-list.html",
})
export class BankList implements OnInit {
  apiResponseS = inject(ApiResponseService);

  dataSignal = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.Banks.getAll)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Banks.delete(id))
      .then((response: boolean) => {
        if (response) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }
}
```

### bank-form.ts

```typescript
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints";

@Component({
  selector: "app-bank-form",
  templateUrl: "./bank-form.html",
  imports: [ReactiveFormsModule],
})
export class BankForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  form: FormGroup = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shortName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    largeName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Banks.getById(this.id))
      .then((result: any) => this.form.patchValue(result));
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.Banks.create, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.Banks.update(this.id), this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
```

## Reglas de Migración

1. **Identificar**: Buscar todas las URLs hardcoded en los archivos de la aplicación
2. **Crear**: Agregar el módulo correspondiente en `endpoints.ts`
3. **Actualizar**: Reemplazar las URLs hardcoded por las constantes del archivo
4. **Verificar**: Asegurar que la aplicación funcione correctamente después del cambio

## Notas Adicionales

- Si el endpoint tiene un prefijo de versión (ej: `api/banks`), definirlo como constante base
- Mantener el archivo ordenado por módulos regroupados por funcionalidad
- Agregar JSDoc comentarios para documentar cada grupo de endpoints
