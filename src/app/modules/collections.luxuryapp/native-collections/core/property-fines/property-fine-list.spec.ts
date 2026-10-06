import { describe, expect, it, vi } from "vitest";
import PropertyFineList from "./property-fine-list";

describe("PropertyFineList (rama de cancelación)", () => {
  it("no anula cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(PropertyFineList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onVoid({ id: "1" });

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
