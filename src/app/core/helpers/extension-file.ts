import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

/**
 * Devuelve el ícono y el color de FontAwesome según la extensión del archivo.
 * @param extension La extensión del archivo (ej. 'pdf', 'xlsx').
 * @returns Un objeto con las clases de CSS para el ícono y el color.
 */
export function getIconForFileHelper(extension: string): {
  icon: AppIconName;
  color: string;
} {
  switch (extension?.toLowerCase()) {
    // Documentos PDF
    case "pdf":
      return { icon: "material-symbols-light:picture-as-pdf", color: "font-danger" };

    // Hojas de cálculo
    case "xlsx":
    case "xls":
      return { icon: "material-symbols-light:table-view", color: "font-success" };

    // Documentos Word
    case "docx":
    case "doc":
      return { icon: "material-symbols-light:description", color: "font-info" };

    // Presentaciones PowerPoint
    case "ppt":
    case "pptx":
      return { icon: "material-symbols-light:slideshow", color: "font-warning" };

    // Archivos comprimidos
    case "zip":
    case "rar":
      return { icon: "material-symbols-light:archive", color: "font-secondary" };

    // Imágenes
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return { icon: "material-symbols-light:photo", color: "font-primary" };

    // Audio
    case "mp3":
    case "wav":
      return { icon: "material-symbols-light:audio-file", color: "font-warning" };

    // Video
    case "mp4":
    case "avi":
      return { icon: "material-symbols-light:movie", color: "font-info" };

    // Código
    case "js":
    case "ts":
    case "html":
    case "css":
    case "jsx":
    case "tsx":
      return { icon: "material-symbols-light:data-object", color: "font-success" };

    // Default
    default:
      return { icon: "material-symbols-light:description", color: "font-secondary" };
  }
}

const App = () => {
  // Mock data for demonstration
  const dataSignal = [
    {
      id: 1,
      documentName: "Informe Anual 2024",
      fileExtension: "pdf",
      filePath: "#",
    },
    {
      id: 2,
      documentName: "Presupuesto Q1",
      fileExtension: "xlsx",
      filePath: "#",
    },
    {
      id: 3,
      documentName: "Presentación Proyecto",
      fileExtension: "pptx",
      filePath: "#",
    },
    {
      id: 4,
      documentName: "Contrato Legal",
      fileExtension: "docx",
      filePath: "#",
    },
    {
      id: 5,
      documentName: "Logo Empresa",
      fileExtension: "png",
      filePath: "#",
    },
    {
      id: 6,
      documentName: "Manual Usuario",
      fileExtension: "pdf",
      filePath: "#",
    },
    {
      id: 7,
      documentName: "Datos Analytics",
      fileExtension: "csv",
      filePath: "#",
    },
    {
      id: 8,
      documentName: "Video Tutorial",
      fileExtension: "mp4",
      filePath: "#",
    },
  ];
};









