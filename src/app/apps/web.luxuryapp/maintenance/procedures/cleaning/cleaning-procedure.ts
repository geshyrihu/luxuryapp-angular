import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GraphModule, Orientation } from "@swimlane/ngx-graph";

@Component({
  selector: "app-cleaning-procedure",
  imports: [CommonModule, RouterModule, GraphModule],
  templateUrl: "./cleaning-procedure.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./cleaning-procedure.scss"],
})
export class CleaningProcedure {
  readonly graphView: [number, number] = [700, 640];
  readonly graphLayoutSettings = {
    orientation: Orientation.TOP_TO_BOTTOM,
    rankPadding: 32,
    nodePadding: 12,
  };

  readonly graphNodes = [
    {
      id: "d1", label: "D1",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 1", question: "¿El objeto funciona correctamente?" },
    },
    {
      id: "d1a", label: "D1a",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 1a", question: "¿Tiene piezas reparables o valor como scrap?" },
    },
    {
      id: "d2", label: "D2",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 2", question: "¿Se necesita en la empresa / área?" },
    },
    {
      id: "d3", label: "D3",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 3", question: "¿Tiene valor comercial?" },
    },
    {
      id: "d4", label: "D4",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 4", question: "¿Está en condiciones de donarse?" },
    },
    {
      id: "d5", label: "D5",
      dimension: { width: 190, height: 130 },
      data: { type: "decision" as const, label: "Decisión 5", question: "¿Es material reciclable?" },
    },
    {
      id: "a1", label: "Desechar",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "bad" as const, emoji: "🗑️", text: "Desechar en contenedor" },
    },
    {
      id: "a2", label: "Reciclaje",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "good" as const, emoji: "🔄", text: "Enviar a reciclaje / taller" },
    },
    {
      id: "a3", label: "Reintegrar",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "good" as const, emoji: "✅", text: "Reintegrar al inventario / área" },
    },
    {
      id: "a4", label: "Vender",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "good" as const, emoji: "💰", text: "Evaluar precio → Poner en venta" },
    },
    {
      id: "a5", label: "Donar",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "good" as const, emoji: "🎁", text: "Donar a instituciones / empleados" },
    },
    {
      id: "a6", label: "Reciclar",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "good" as const, emoji: "♻️", text: "Separar por tipo → Reciclaje" },
    },
    {
      id: "a7", label: "Basura",
      dimension: { width: 190, height: 52 },
      data: { type: "action" as const, outcome: "bad" as const, emoji: "🗑️", text: "Desechar como basura" },
    },
  ];

  readonly graphLinks = [
    { id: "l1", source: "d1", target: "d1a", label: "NO", data: { kind: "no" } },
    { id: "l2", source: "d1", target: "d2", label: "SÍ", data: { kind: "yes" } },
    { id: "l3", source: "d1a", target: "a1", label: "NO", data: { kind: "no" } },
    { id: "l4", source: "d1a", target: "a2", label: "SÍ", data: { kind: "yes" } },
    { id: "l5", source: "d2", target: "a3", label: "SÍ", data: { kind: "yes" } },
    { id: "l6", source: "d2", target: "d3", label: "NO", data: { kind: "no" } },
    { id: "l7", source: "d3", target: "a4", label: "SÍ", data: { kind: "yes" } },
    { id: "l8", source: "d3", target: "d4", label: "NO", data: { kind: "no" } },
    { id: "l9", source: "d4", target: "a5", label: "SÍ", data: { kind: "yes" } },
    { id: "l10", source: "d4", target: "d5", label: "NO", data: { kind: "no" } },
    { id: "l11", source: "d5", target: "a6", label: "SÍ", data: { kind: "yes" } },
    { id: "l12", source: "d5", target: "a7", label: "NO", data: { kind: "no" } },
  ];
}
