import { describe, expect, it, vi } from "vitest";
import { FederalLaborLawParameters } from "./federal-labor-law-parameters";

describe("FederalLaborLawParameters (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(FederalLaborLawParameters.prototype);
    ctx.swalS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.deletingYear = () => null;
    ctx.api = { onDelete: vi.fn() };

    await ctx.delete({ year: 2026 });

    expect(ctx.swalS.confirm).toHaveBeenCalledOnce();
    expect(ctx.api.onDelete).not.toHaveBeenCalled();
  });
});
