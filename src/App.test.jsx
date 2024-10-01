import React from "react";
import { it, expect } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

it("renders search input", async () => {
  const { getByPlaceholderText } = render(<App />);

  const searchBox = getByPlaceholderText(/Enter keyword here/i);
  expect(searchBox).toBeInTheDocument();

  fireEvent.change(searchBox, { target: { value: "test" } });

  await waitFor(() => {
    expect(searchBox.value).toBe("test");
  });
});
