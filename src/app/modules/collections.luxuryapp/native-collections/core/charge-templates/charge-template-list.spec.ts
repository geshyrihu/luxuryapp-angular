import { describe, expect, it, vi } from "vitest";
import ChargeTemplateList from "./charge-template-list";

describe("ChargeTemplateList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(ChargeTemplateList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete({ id: "1" });

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
