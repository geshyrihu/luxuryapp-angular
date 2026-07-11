import { Injectable } from "@angular/core";
import { SubMenuItem } from "src/app/core/interfaces/menu.model";
import { MenuService } from "src/app/core/services/menu.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  public text: string = "";
  // itemsData ahora se deriva reactivamente del MenuService
  public itemsData = this.menuService.sidebarMenuItems;
  public menuItems: SubMenuItem[] = [];
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;

  constructor(public menuService: MenuService) {}
  // ngOnDestroy ya no es necesario para desuscribirse manualmente

  searchTerm(term: string) {
    term ? this.addFix() : this.removeFix();
    if (!term) {
      this.menuItems = [];
      return;
    }

    let results: SubMenuItem[] = [];
    term = term.toLowerCase();

    const currentItems = this.itemsData();
    for (const item of currentItems) {
      // Busca en el item de primer nivel (solo si tiene routerLink)
      if (item.label?.toLowerCase().includes(term) && item.routerLink) {
        results.push({
          id: item.id,
          label: item.label,
          routerLink: item.routerLink,
          nameModule: item.nameModule,
        });
      }

      // Busca en los subitems
      if (item.items && item.items.length > 0) {
        for (const subItem of item.items) {
          if (
            subItem.label?.toLowerCase().includes(term) &&
            subItem.routerLink
          ) {
            results.push({
              id: subItem.id,
              label: subItem.label,
              routerLink: subItem.routerLink,
              nameModule: subItem.nameModule,
            });
          }
        }
      }
    }

    this.checkSearchResultEmpty(results);
    this.menuItems = results;
  }

  checkSearchResultEmpty(items: SubMenuItem[]) {
    this.searchResultEmpty = !items.length;
  }

  addFix() {
    this.searchResult = true;
  }

  clickOutSide(): void {
    this.text = "";
    this.searchResult = false;
    this.searchResultEmpty = false;
  }

  removeFix() {
    this.text = "";
    this.searchResult = false;
  }
}
