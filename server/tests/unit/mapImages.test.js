import { describe, expect, test } from "vitest";
import { mapImages } from "../../utils/mapImages.js";

describe("mapImages", () => {
  test("maps root, nested object, and nested array image fields without mutating the source", () => {
    const document = {
      image: "product.jpg",
      banner: { image: "banner.jpg" },
      ingredients: [{ image: "cheese.jpg" }, { image: null }],
    };

    const result = mapImages(document, null, [
      { path: "", field: "image" },
      { path: "banner", field: "image" },
      { path: "ingredients", field: "image" },
    ]);

    expect(result).toEqual({
      image: "/uploads/product.jpg",
      banner: { image: "/uploads/banner.jpg" },
      ingredients: [{ image: "/uploads/cheese.jpg" }, { image: null }],
    });
    expect(document.image).toBe("product.jpg");
    expect(document.ingredients[0].image).toBe("cheese.jpg");
  });
});
