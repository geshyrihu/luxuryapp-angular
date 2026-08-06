import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, from, switchMap } from "rxjs";
import { ImageProcessingService } from "../../services/image-processing.service";

/**
 * Garantia transversal para cargas multipart.
 *
 * Convierte y normaliza las imagenes antes de que la solicitud salga del
 * navegador. Los archivos que no son imagenes y los campos escalares se
 * conservan intactos.
 */
export const imageFormDataInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (typeof FormData === "undefined" || !(request.body instanceof FormData)) {
    return next(request);
  }

  const imageProcessing = inject(ImageProcessingService);

  return from(imageProcessing.processFormData(request.body)).pipe(
    switchMap((body) => next(request.clone({ body }))),
  );
};
