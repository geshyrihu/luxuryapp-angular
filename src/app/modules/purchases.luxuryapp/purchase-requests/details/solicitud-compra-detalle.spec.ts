import { describe, expect, it, vi } from "vitest";
import { SolicitudCompraDetalle } from "./solicitud-compra-detalle";

describe("SolicitudCompraDetalle (rama de cancelación)", () => {
  it("no elimina el producto cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(SolicitudCompraDetalle.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDeleteProduct("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
