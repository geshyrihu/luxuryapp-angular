import { describe, expect, it, vi } from "vitest";
import { DocumentoPersonalizadoLista } from "./documento-personalizado-lista";

describe("DocumentoPersonalizadoLista (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(DocumentoPersonalizadoLista.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
