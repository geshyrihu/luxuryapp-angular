import { describe, expect, it, vi } from "vitest";
import { OrdenCompraFacturaForm } from "./orden-compra-factura-form";

describe("OrdenCompraFacturaForm (rama de cancelación)", () => {
  it("no elimina la factura cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(OrdenCompraFacturaForm.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDeleteInvoice("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
