import React from "react";
import { render } from "@testing-library/react";
import { useInView } from "react-intersection-observer";
import ItemsGrid from "./ItemsGrid";
import { vi ,describe, beforeEach, it, expect} from 'vitest';


vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(),
}));
const ref = React.createRef();

vi.mock("@components/ItemCard", () => ({
  default: vi.fn(() => <div data-testid="mocked-item-card">ItemCard</div>),
}));

describe("ItemsGrid", () => {
  beforeEach(() => {
    useInView.mockReturnValue([ref, false]);
  });

  it("renders the correct number of items if in view", () => {
    useInView.mockReturnValue([ref, true]);
    const { getAllByText } = render(<ItemsGrid data={[1, 2, 3]} />);

    expect(getAllByText(/ItemCard/).length).toBe(3);
  });

  it("does not render items if NOT in view", () => {
    useInView.mockReturnValue([ref, false]);
    const { queryAllByText } = render(<ItemsGrid data={[1, 2, 3]} />);

    expect(queryAllByText(/ItemCard/).length).toBe(0);
  });
});
