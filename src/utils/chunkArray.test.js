import { describe, it, expect } from "vitest";
import { chunkArray } from "./chunkArray";

describe("chunkArray", () => {
  it("splits array into chunks of the correct size", () => {
    const array = [1, 2, 3, 4, 5, 6];
    const chunkSize = 2;
    const result = chunkArray(array, chunkSize);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("handles arrays that don't split evenly", () => {
    const array = [1, 2, 3, 4, 5];
    const chunkSize = 2;
    const result = chunkArray(array, chunkSize);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns empty array when input array is empty", () => {
    const array = [];
    const chunkSize = 2;
    const result = chunkArray(array, chunkSize);
    expect(result).toEqual([]);
  });
});
