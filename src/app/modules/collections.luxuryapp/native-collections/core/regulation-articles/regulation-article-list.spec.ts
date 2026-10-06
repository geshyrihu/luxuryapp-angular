import { describe, expect, it, vi } from "vitest";
import RegulationArticleList from "./regulation-article-list";

describe("RegulationArticleList (rama de cancelación)", () => {
  it("no elimina cuando la confirmación se cancela", async () => {
    const ctx: any = Object.create(RegulationArticleList.prototype);
    ctx.confirmS = { confirm: vi.fn().mockResolvedValue(false) };
    ctx.apiResponseS = { onDelete: vi.fn() };

    await ctx.onDelete({ id: "1" });

    expect(ctx.confirmS.confirm).toHaveBeenCalledOnce();
    expect(ctx.apiResponseS.onDelete).not.toHaveBeenCalled();
  });
});
