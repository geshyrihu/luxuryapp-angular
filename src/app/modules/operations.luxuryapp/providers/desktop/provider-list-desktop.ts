import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxRating } from "@ui/adaptive/rating/rating";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxSearchInput } from "@ui/inputs/web/lux-search-input-signal";
import { SegmentedControl } from "@ui/primitives/segmented-control/segmented-control";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AppPaginator } from "@ui/web/paginator/paginator";

@Component({
  selector: "app-provider-list-desktop",
  templateUrl: "./provider-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LxAvatar,
    LxRating,
    LxTag,
    LxTooltipDirective,
    LuxSearchInput,
    SegmentedControl,
    LxIcon,
    AppPaginator],
})
export class ProviderListDesktop {
  data = input.required<any[]>();
  serviceTypes = input<{ label: string; value: any }[]>([]);
  serviceTypeControl = input<FormControl>(new FormControl());
  rolAuth = input<boolean>(false);
  label = input<string>("Agregar");
  page = input<number>(1);
  rows = input<number>(30);
  totalRecords = input<number>(0);
  rowsPerPageOptions = input<number[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  filter = output<string>();
  serviceTypeChange = output<any>();
  pageChange = output<{ page: number; rows: number }>();
  showCard = output<any>();
  calificar = output<any>();
  activate = output<any>();
  authorized = output<any>();
  coincidencias = output<any>();

  readonly roles = ApplicationRole;

  validateRole(value: ApplicationRole[]): boolean {
    return value.includes(ApplicationRole.SuperUsuario);
  }

  calificacionPromedio(data: any[], valor: string): number {
    let suma: number = 0;
    data.forEach((element) => {
      suma += element[valor];
    });
    const restult = suma / data.length;

    return restult;
  }
}
