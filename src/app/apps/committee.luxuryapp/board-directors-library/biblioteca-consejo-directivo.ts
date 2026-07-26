import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
export interface DocumentCategory {
  title: string;
  image: string;
  routeParam: string;
  allowedCustomerIds?: string[];
}

@Component({
  selector: "app-biblioteca-consejo-directivo",
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./biblioteca-consejo-directivo.html",
})
export class BibliotecaConsejoDirectivo implements OnInit {
  customerIdS = inject(CustomerIdService);
  public documentCategories: DocumentCategory[] = [];

  private allCategories: DocumentCategory[] = [
    {
      title: "Acta Constitutiva",
      image: "assets/images/comite/acta-constitutiva.jpg",
      routeParam: "incorporation-deeds",
    },
    {
      title: "Asambleas",
      image: "assets/images/comite/asambleas.jpg",
      routeParam: "assemblies",
    },
    {
      title: "Contratos proveedores",
      image: "assets/images/comite/contratos-proveedores.jpg",
      routeParam: "maintenance-policy",
    },
    {
      title: "Juicios",
      image: "assets/images/comite/juicios.jpg",
      routeParam: "lawsuits",
    },
    {
      title: "Concesión barranca",
      image: "assets/images/comite/concesion.jpg",
      routeParam: "ravine-concession",
      allowedCustomerIds: ["3"],
    },
    {
      title: "Concesión pozo",
      image: "assets/images/comite/concesion.jpg",
      routeParam: "well-concession",
      allowedCustomerIds: ["4"],
    },
  ];

  ngOnInit(): void {
    this.filterCategoriesByCustomerId();
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
