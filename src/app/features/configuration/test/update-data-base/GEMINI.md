# Guóa de Extensián: UpdateDataBase (Frontend)

Este componente permite ejecutar scripts de mantenimiento y migración de base de datos.

## Pasos para agregar un nuevo script:

1. **En `update-data-base.ts`**:
   - Agrega un nuevo método `runNombreDeTuScript()`.
   - Usa `this.loading.set(true)` y `this.result.set(null)` al inicio.
   - Llama al endpoint usando `this.apiResponseS.onPost(...)` (o el método que corresponda).
   - Maneja el éxito con `this.customToastS.showSuccess(...)` y el error con `this.customToastS.showError(...)`.
   - Asegúrate de resetear `this.loading.set(false)` en ambos casos.

   ```typescript
   runMiNuevoScript() {
     this.loading.set(true);
     this.result.set(null);
     this.customToastS.showInfo("Iniciando...", "Espere...");

     this.apiResponseS.onPost("UpdateDataBase/mi-nuevo-endpoint", {})
       .then((res: any) => {
         this.result.set(res);
         this.customToastS.showSuccess("Éxito", "Proceso completado.");
         this.loading.set(false);
       })
       .catch((err) => {
         console.error(err);
         this.result.set(err.error);
         this.customToastS.showError("Error", "El proceso falló.");
         this.loading.set(false);
       });
   }
   ```

2. **En `update-data-base.html`**:
   - Agrega un nuevo bloque de tarjeta (`p-card`) dentro del `grid`.
   - Asocia el evento `(click)` a tu nuevo método.
   - Define un emoji o icono representativo.

   ```html
   <div class="col-12 md:col-6 lg:col-4">
     <p-card
       class="cursor-pointer h-full block"
       styleClass="h-full border-1 surface-border hover:surface-100 transition-all transition-duration-200"
       (click)="runMiNuevoScript()"
     >
       <div class="flex align-items-start gap-3">
         <div class="flex w-3rem h-3rem flex-shrink-0 align-items-center justify-content-center border-round-xl bg-primary-50 text-2xl">
           🚀
         </div>
         <div class="flex flex-column gap-1">
           <div class="font-bold text-900">Mi Nuevo Script</div>
           <div class="text-xs text-color-secondary line-height-2">
             Descripción breve de lo que hace el script.
           </div>
         </div>
       </div>
     </p-card>
   </div>
   ```
