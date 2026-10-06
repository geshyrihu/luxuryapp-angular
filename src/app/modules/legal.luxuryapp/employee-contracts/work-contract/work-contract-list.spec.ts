import { describe, expect, it, vi } from "vitest";
import { WorkContractList } from "./work-contract-list";

describe("WorkContractList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(WorkContractList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiS = { onDelete: vi.fn() };

    await ctx.onDelete("1");

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiS.onDelete).not.toHaveBeenCalled();
  });
});
