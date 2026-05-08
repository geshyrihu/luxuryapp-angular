import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { DndModule } from "ngx-drag-drop"; // Importar ngx-drag-drop
import { AvatarModule } from "primeng/avatar";
import { TagModule } from "primeng/tag";
import { IOrgChartTreeNode } from "../../models/org-chart.interfaces";
import { OrgChart } from "../org-chart/org-chart";

@Component({
  selector: "app-org-node",

  imports: [CommonModule, DndModule, AvatarModule, TagModule],
  templateUrl: "./org-node.html",
  styleUrl: "./org-node.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgNode {
  // Inyectamos el padre para acceder a su lgica y estado
  readonly parent = inject(OrgChart);

  // Recibe el nodo actual del rbol
  node = input.required<IOrgChartTreeNode>();

  // Nivel de profundidad (0 = raz virtual, 1 = primeros jefes, etc.)
  level = input<number>(0);

  // Indica si es un nodo raz
  isRoot = input<boolean>(false);
}
