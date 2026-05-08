import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ISubMenuItem } from "src/app/core/interfaces/menu.model";
import { SearchService } from "src/app/core/services/search.service";
@Component({
  selector: "app-search",
  templateUrl: "./search.html",
  imports: [RouterModule, FormsModule, AutoCompleteModule],
})
export class Search {
  private router = inject(Router);
  text: string;
  constructor(public searchService: SearchService) {}

  // Llama al método de búsqueda del servicio
  search(event: any) {
    this.searchService.searchTerm(event.query);
  }

  // Navega al seleccionar un item y limpia el overlay
  onSelect(item: ISubMenuItem) {
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
      this.searchService.removeFix();
      this.text = ""; // Limpia el texto del input
    }
  }

  // Limpia el overlay si el usuario borra la búsqueda o hace clic fuera
  onBlur() {
    setTimeout(() => this.searchService.removeFix(), 150);
  }
}









