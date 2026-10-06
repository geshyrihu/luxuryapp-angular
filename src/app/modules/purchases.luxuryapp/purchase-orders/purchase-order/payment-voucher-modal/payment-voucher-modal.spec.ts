import { describe, expect, it, vi } from "vitest";
import { PaymentVoucherModal } from "./payment-voucher-modal";

describe("PaymentVoucherModal (rama de cancelación)", () => {
  it("no elimina el comprobante cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(PaymentVoucherModal.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
