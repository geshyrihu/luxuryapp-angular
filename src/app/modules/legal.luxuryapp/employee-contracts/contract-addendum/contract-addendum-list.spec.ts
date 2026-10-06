import { describe, expect, it, vi } from "vitest";
import { ContractAddendumList } from "./contract-addendum-list";

describe("ContractAddendumList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(ContractAddendumList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiS.onDelete).not.toHaveBeenCalled();
  });
});
