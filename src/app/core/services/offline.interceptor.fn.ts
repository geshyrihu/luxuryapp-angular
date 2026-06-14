import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SyncQueueService, BYPASS_OFFLINE_INTERCEPTOR } from './sync-queue.service';

export const offlineInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const injector = inject(Injector);

  // Si esta petición viene de la cola de sincronización, la dejamos pasar sin interceptarla
  if (req.context.get(BYPASS_OFFLINE_INTERCEPTOR)) {
    return next(req);
  }

  // Solo nos importan las peticiones que mutan datos
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // El status === 0 suele significar falta de conexión a internet
      if (isMutation && error.status === 0 && !navigator.onLine) {
        
        // Extraer los headers en un formato serializable
        const headersRecord: Record<string, string | string[]> = {};
        req.headers.keys().forEach(key => {
          const val = req.headers.getAll(key);
          if (val !== null) headersRecord[key] = val;
        });

        // Obtener el servicio de forma perezosa para evitar dependencia circular
        const syncQueueService = injector.get(SyncQueueService);

        // Encolar la petición
        syncQueueService.enqueueRequest({
          id: crypto.randomUUID(),
          url: req.url,
          method: req.method,
          body: req.body,
          headers: headersRecord,
          timestamp: Date.now()
        });

        // Retornar una respuesta falsa (Mock) para que la UI crea que funcionó
        // y el ApiResponseService lo procese como "Success"
        return of(new HttpResponse({
          status: 200,
          body: {
            success: true,
            message: "Sin red. Acción guardada localmente para sincronización.",
            data: null,
            errors: []
          }
        }));
      }

      return throwError(() => error);
    })
  );
};
