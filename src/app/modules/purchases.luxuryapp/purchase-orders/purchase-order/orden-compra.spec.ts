import { describe, expect, it, vi } from "vitest";
import { OrdenCompra } from "./orden-compra";

describe("OrdenCompra (rama de cancelación)", () => {
  it("no elimina el producto cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(OrdenCompra.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDeleteProduct("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });

  it("no elimina el presupuesto cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(OrdenCompra.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDeleteOrdenCompraPresupuesto("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
