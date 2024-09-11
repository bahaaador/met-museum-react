import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

it("renders search input", () => {
  const { getByPlaceholderText } = render(<App />);
  
  const searchBox = getByPlaceholderText(/Enter keyword here/i);
  expect(searchBox).toBeInTheDocument();

  fireEvent.change(searchBox, { target: { value: "test" } });
  
  expect(searchBox.value).toBe("test");
});
