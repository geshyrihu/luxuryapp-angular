import { describe, expect, it, vi } from "vitest";
import { FormularioPlantillaEvaluacion } from "./formulario-plantilla-evaluacion";

describe("FormularioPlantillaEvaluacion (rama de cancelación)", () => {
  it("no remueve la categoría cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(FormularioPlantillaEvaluacion.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    Object.defineProperty(ctx, "categories", {
      value: { removeAt: vi.fn() },
      configurable: true,
    });

    await ctx.removeCategory(0);

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.categories.removeAt).not.toHaveBeenCalled();
  });

  it("no remueve la pregunta cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(FormularioPlantillaEvaluacion.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.questions = vi.fn();

    await ctx.removeQuestion(0, 0);

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.questions).not.toHaveBeenCalled();
  });
});
