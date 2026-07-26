import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenuOption } from "src/app/core/interfaces/menu-option.interface";

@Component({
  selector: "app-home-comite",
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./home-comite.html",
})
export class HomeComite {
  public comiteMenuOptions: MenuOption[] = [
    {
      title: "Junta Mensual",
      routeParam: "board-directors/monthly-meetings",
      image: "assets/images/comite/junta-mensual.jpg",
    },
    {
      title: "Minutas",
      routeParam: "board-directors/meeting-minutes",
      image: "assets/images/comite/minutas.jpg",
    },
    {
      title: "Informe Financiero",
      routeParam: "board-directors/financial-reports",
      image: "assets/images/comite/informe-financiero.jpg",
    },
    {
      title: "Legal",
      routeParam: "board-directors/documents",
      image: "assets/images/comite/documentos.jpg",
    },
    {
      title: "Reglamentos",
      routeParam: "board-directors/documents/regulations",
      image: "assets/images/comite/reglamentos.jpg",
    },
    {
      title: "Poliza del Edificio",
      routeParam: "board-directors/building-insurance-policy",
      image: "assets/images/comite/poliza-seguro.jpg",
    },
    {
      title: "Cobranza",
      routeParam: "cobranza",
      image: "assets/images/comite/cobranza.webp",
    },
  ];

  /** Oculta la imagen rota (queda el fondo navy de la tarjeta). */
  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = "hidden";
  }

  /** Muestra la imagen al cargar bien. */
  onImgLoad(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = "visible";
  }
}
