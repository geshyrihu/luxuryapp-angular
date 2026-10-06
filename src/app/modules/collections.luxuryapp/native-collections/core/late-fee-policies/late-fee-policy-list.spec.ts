import { describe, expect, it, vi } from "vitest";
import LateFeePolicyList from "./late-fee-policy-list";

describe("LateFeePolicyList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(LateFeePolicyList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete({ id: "1" });

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
