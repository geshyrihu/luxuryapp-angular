import { inject, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "sanitizeHtml",
})
export class SanitizeHtmlPipe implements PipeTransform {
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustHtml(""); // Return empty SafeHtml
    }
    // Continúa con el procesamiento si `value` es válido
    // Strips HTML tags, then marks the result as safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(
      value.replace(/<\/?[^>]+(>|$)/g, ""),
    );
  }
}









