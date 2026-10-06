import { describe, expect, it, vi } from "vitest";
import { FederalVacationParameters } from "./federal-vacation-parameters";

describe("FederalVacationParameters (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(FederalVacationParameters.prototype);
    ctx.swalS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.deletingKey = () => null;
    ctx.api = { onDelete: vi.fn() };

    await ctx.deleteParameter({ yearsOfService: 1, year: 2026 });

    expect(ctx.swalS.confirm).toHaveBeenCalledOnce();
    expect(ctx.api.onDelete).not.toHaveBeenCalled();
  });
});
