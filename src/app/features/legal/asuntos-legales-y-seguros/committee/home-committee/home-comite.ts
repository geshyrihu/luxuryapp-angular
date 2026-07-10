import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { IonRippleEffect } from "@ionic/angular/standalone";
import { LxImage } from "@ui/adaptive/image/image";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { MenuOption } from "src/app/core/interfaces/menu-option.interface";
@Component({
  selector: "app-home-comite",
  imports: [RouterModule, IonRippleEffect, LxImage],
  templateUrl: "./home-comite.html",
})
export class HomeComite implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);
  public comiteMenuOptions: MenuOption[] = [
    {
      title: "Junta Mensual",
      routeParam: "board-directors/monthly-meetings",
      image: "assets/images/committee/junta-mensual.jpg", // Imagen de fallback
    },
    {
      title: "Minutas",
      routeParam: "board-directors/meeting-minutes",
      image: "assets/images/committee/minutas.jpg", // Imagen de fallback
    },
    {
      title: "Informe Financiero",
      routeParam: "board-directors/financial-reports",
      image: "assets/images/committee/informe-financiero.jpg", // Imagen de fallback
    },
    {
      title: "Legal",
      routeParam: "board-directors/documents",
      image: "assets/images/committee/documentos.jpg", // Imagen de fallback
    },
    {
      title: "Reglamentos",
      routeParam: "board-directors/documents/regulations",
      image: "assets/images/committee/reglamentos.jpg", // Imagen de fallback
    },
    {
      title: "Poliza del Edificio",
      routeParam: "board-directors/building-insurance-policy",
      image: "assets/images/committee/poliza-seguro.jpg", // Imagen de fallback
    },
  ];

  ngOnInit(): void {
    this.loadImages();
  }

  private async loadImages(): Promise<void> {
    const imageUrlMap = await this.apiResponseS.onGetList<
      Record<string, string>
    >("File/comite-home-images");
    console.log(
      "?? ~ BibliotecaConsejoDirectivo ~ loadImages ~ imageUrlMap:",
      imageUrlMap,
    );
    if (imageUrlMap) {
      this.comiteMenuOptions.forEach((option) => {
        const imageKey = this.getImageKeyFromPath(option.image);
        if (imageUrlMap[imageKey]) {
          option.image = imageUrlMap[imageKey];
        }
      });
      this.cdRef.detectChanges();
    }
  }

  private getImageKeyFromPath(path: string): string {
    // Extrae el nombre del archivo sin la extensión. Ej: 'assets/images/committee/junta-mensual.jpg' -> 'junta-mensual'
    return path.split("/").pop()?.split(".")[0].toLowerCase() ?? "";
  }

  navigateTo(route: string) {
    this.router.navigate([route], { relativeTo: this.activeRoute });
  }
}
