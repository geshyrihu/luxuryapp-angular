import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
export interface DocumentCategory {
  title: string;
  image: string;
  routeParam: string;
  allowedCustomerIds?: string[];
}

@Component({
  selector: "app-biblioteca-consejo-directivo",
  imports: [RouterModule],
  templateUrl: "./biblioteca-consejo-directivo.html",
})
export class BibliotecaConsejoDirectivo implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  cdRef = inject(ChangeDetectorRef);
  public documentCategories: DocumentCategory[] = [];

  private allCategories: DocumentCategory[] = [
    {
      title: "Acta Constitutiva",
      image: "assets/images/board-directors-library/acta-constitutiva.jpg",
      routeParam: "incorporation-deeds",
    },
    {
      title: "Asambleas",
      image: "assets/images/board-directors-library/asambleas.jpg",
      routeParam: "assemblies",
    },
    {
      title: "Contratos proveedores",
      image: "assets/images/board-directors-library/contratos-proveedores.jpg",
      routeParam: "maintenance-policy",
    },
    {
      title: "Juicios",
      image: "assets/images/board-directors-library/juicios.jpg",
      routeParam: "lawsuits",
    },
    {
      title: "Concesión barranca",
      image: "assets/images/board-directors-library/concesion.jpg",
      routeParam: "ravine-concession",
      allowedCustomerIds: ["3"],
    },
    {
      title: "Concesión pozo",
      image: "assets/images/board-directors-library/concesion.jpg",
      routeParam: "well-concession",
      allowedCustomerIds: ["4"],
    },
  ];

  ngOnInit(): void {
    this.loadContent();
  }

  private async loadContent(): Promise<void> {
    await this.loadImages();
    this.filterCategoriesByCustomerId();
    this.cdRef.detectChanges();
  }

  private async loadImages(): Promise<void> {
    const imageUrlMap = await this.apiResponseS.onGetList<
      Record<string, string>
    >(Endpoints.File.comiteHomeImages);

    if (imageUrlMap) {
      this.allCategories.forEach((category) => {
        const imageKey = this.getImageKeyFromPath(category.image);
        if (imageUrlMap[imageKey]) {
          category.image = imageUrlMap[imageKey];
        }
      });
    }
  }

  private getImageKeyFromPath(path: string): string {
    // Extrae el nombre del archivo sin la extensión. Ej: 'assets/images/board-directors-library/acta-constitutiva.jpg' -> 'acta-constitutiva'
    return path.split("/").pop()?.split(".")[0].toLowerCase() ?? "";
  }

  private filterCategoriesByCustomerId(): void {
    const currentCustomerId = this.customerIdS.customerId();

    this.documentCategories = this.allCategories.filter((category) => {
      if (!category.allowedCustomerIds) {
        return true;
      }
      return category.allowedCustomerIds.includes(currentCustomerId);
    });
  }
}
