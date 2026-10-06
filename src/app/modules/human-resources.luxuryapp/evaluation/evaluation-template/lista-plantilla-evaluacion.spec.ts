import { describe, expect, it, vi } from "vitest";
import { ListaPlantillaEvaluacion } from "./lista-plantilla-evaluacion";

describe("ListaPlantillaEvaluacion (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(ListaPlantillaEvaluacion.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
