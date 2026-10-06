import { describe, expect, it, vi } from "vitest";
import { StateTaxParameters } from "./state-tax-parameters";

describe("StateTaxParameters (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(StateTaxParameters.prototype);
    ctx.swalS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.deletingKey = () => null;
    ctx.api = { onDelete: vi.fn() };

    await ctx.delete({ state: 1, year: 2026 });

    expect(ctx.swalS.confirm).toHaveBeenCalledOnce();
    expect(ctx.api.onDelete).not.toHaveBeenCalled();
  });
});
