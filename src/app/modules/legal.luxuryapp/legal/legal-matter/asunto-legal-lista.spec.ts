import { describe, expect, it, vi } from "vitest";
import { AsuntoLegalLista } from "./asunto-legal-lista";

describe("AsuntoLegalLista (rama de cancelación)", () => {
  it("no elimina el asunto cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(AsuntoLegalLista.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });

  it("no elimina la categoría cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(AsuntoLegalLista.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDeleteCategorie("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
