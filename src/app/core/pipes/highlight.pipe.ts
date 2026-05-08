import { Pipe, PipeTransform, inject } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"; // Importa DomSanitizer y SafeHtml

@Pipe({ name: "highlight", standalone: true }) // Es buena práctica hacerlo standalone
export class HighlightPipe implements PipeTransform {
  // Inyecta el DomSanitizer
  private sanitizer = inject(DomSanitizer);
  transform(value: string, search: string): SafeHtml {
    // El pipe ahora devuelve SafeHtml
    if (!search || !value) return value;

    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const searchTerms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map(normalize);

    // Si no hay términos de búsqueda válidos, devuelve el valor original
    if (searchTerms.length === 0) return value;

    const regex = new RegExp(`(${searchTerms.join("|")})`, "gi");

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${value}</div>`, "text/html");
    const container = doc.body.firstChild as HTMLElement;

    function highlight(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const originalText = node.textContent || "";
        // No normalices aquí, hazlo solo para la comparación
        const normalizedText = normalize(originalText.toLowerCase());

        // Usamos el regex directamente sobre el texto normalizado para encontrar posiciones
        const matches = [...normalizedText.matchAll(regex)];
        if (!matches.length) return;

        const span = document.createElement("span");
        let lastIndex = 0;

        for (const match of matches) {
          const start = match.index!;
          const end = start + match[0].length;

          // Extrae las partes del texto original, no del normalizado
          const originalPart = originalText.slice(lastIndex, start);
          const matchPart = originalText.slice(start, end);

          if (originalPart)
            span.appendChild(document.createTextNode(originalPart));

          const mark = document.createElement("mark");
          mark.textContent = matchPart;
          span.appendChild(mark);

          lastIndex = end;
        }

        const rest = originalText.slice(lastIndex);
        if (rest) span.appendChild(document.createTextNode(rest));

        if (node.parentNode) {
          node.parentNode.replaceChild(span, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
        Array.from(node.childNodes).forEach(highlight);
      }
    }

    highlight(container);

    // ¡LA MAGIA ESTÁ AQUÍ!
    // En lugar de devolver un string, le decimos a Angular que confíe en este HTML.
    return this.sanitizer.bypassSecurityTrustHtml(container.innerHTML);
  }
}









