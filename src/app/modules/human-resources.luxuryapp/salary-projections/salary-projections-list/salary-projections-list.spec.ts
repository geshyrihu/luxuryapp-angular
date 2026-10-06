import { describe, expect, it, vi } from "vitest";
import { SalaryProjectionsList } from "./salary-projections-list";

describe("SalaryProjectionsList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(SalaryProjectionsList.prototype);
    ctx.swalS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.deletingId = () => null;
    ctx.api = { onDelete: vi.fn() };

    await ctx.deleteProjection({ id: "1" });

    expect(ctx.swalS.confirm).toHaveBeenCalledOnce();
    expect(ctx.api.onDelete).not.toHaveBeenCalled();
  });
});
