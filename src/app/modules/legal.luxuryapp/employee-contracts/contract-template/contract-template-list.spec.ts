import { describe, expect, it, vi } from "vitest";
import { ContractTemplateList } from "./contract-template-list";

describe("ContractTemplateList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(ContractTemplateList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiS.onDelete).not.toHaveBeenCalled();
  });
});
