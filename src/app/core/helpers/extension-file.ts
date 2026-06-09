/**
 * Devuelve el ícono y el color de FontAwesome según la extensión del archivo.
 * @param extension La extensión del archivo (ej. 'pdf', 'xlsx').
 * @returns Un objeto con las clases de CSS para el ícono y el color.
 */
export function getIconForFileHelper(extension: string): {
  icon: string;
  color: string;
} {
  switch (extension?.toLowerCase()) {
    // Documentos PDF
    case "pdf":
      return { icon: "mdi:file-pdf-box", color: "font-danger" };

    // Hojas de cálculo
    case "xlsx":
    case "xls":
      return { icon: "mdi:file-excel", color: "font-success" };

    // Documentos Word
    case "docx":
    case "doc":
      return { icon: "mdi:file-word", color: "font-info" };

    // Presentaciones PowerPoint
    case "ppt":
    case "pptx":
      return { icon: "mdi:file-powerpoint", color: "font-warning" };

    // Archivos comprimidos
    case "zip":
    case "rar":
      return { icon: "mdi:file-archive", color: "font-secondary" };

    // Imágenes
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return { icon: "mdi:image", color: "font-primary" };

    // Audio
    case "mp3":
    case "wav":
      return { icon: "mdi:file-audio", color: "font-warning" };

    // Video
    case "mp4":
    case "avi":
      return { icon: "mdi:file-video", color: "font-info" };

    // Código
    case "js":
    case "ts":
    case "html":
    case "css":
    case "jsx":
    case "tsx":
      return { icon: "mdi:file-code", color: "font-success" };

    // Default
    default:
      return { icon: "mdi:file-document-outline", color: "font-secondary" };
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









