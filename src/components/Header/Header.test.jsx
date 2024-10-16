import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import { fetchSearchResult } from "@api/museumApi";
import Header from "./Header";

vi.mock("@api/museumApi", () => ({
  fetchSearchResult: vi.fn(),
}));

// spyOn(window, "addEventListener").mockImplementation();


describe("Header component", () => {
  beforeEach(() => {
    fetchSearchResult.mockClear();
  });

  it("updates the keyword and fetches result when the input is updated", async () => {
    const dummyData = {
      total: 10,
      objectIDs: [1, 2, 3, 4, 5],
    };

    fetchSearchResult.mockResolvedValue(dummyData);

    render(<Header />);

    // Simulate typing into the input field
    const input = screen.getByTestId("searchInput");

    fireEvent.change(input, { target: { value: "test" } });

    const caption = await screen.findByText("10 results for: test");

    expect(caption).toBeInTheDocument();

    expect(fetchSearchResult).toHaveBeenCalled();
  });
});
