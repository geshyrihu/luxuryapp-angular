import { Pipe, PipeTransform } from "@angular/core";
import { AreaMinutasDetalles } from "@core/enums/area-minutas-detalles.enum";
import { onGetSelectItemFromEnum } from "@core/helpers/enumeration";
@Pipe({
  name: "eAreaMinutasDetalles",
})
export class EAreaMinutasDetallesPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(AreaMinutasDetalles);
  transform(value: unknown): string {
    let dato: string = "";
    if (value === null) {
      dato = "";
    } else {
      this.enum.forEach((item) => {
        if (value === item.value) {
          dato = item.label;
        }
      });
    }
    return dato;
  }
}










