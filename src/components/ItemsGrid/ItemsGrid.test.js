import React from "react";
import { render } from "@testing-library/react";
import { useInView } from "react-intersection-observer";
import ItemsGrid from "./ItemsGrid";

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(),
}));

jest.mock("components/ItemCard", () => () => <div>ItemCard</div>);

describe("ItemsGrid", () => {
  beforeEach(() => {
    useInView.mockReturnValue([{}, false]);
  });

  it("renders the correct number of items if in view", () => {
    useInView.mockReturnValue([{}, true]);
    const { queryAllByText } = render(<ItemsGrid data={[1, 2, 3]} />);

    expect(queryAllByText(/ItemCard/).length).toBe(3);
  });

  it("does not render items if NOT in view", () => {
    useInView.mockReturnValue([{}, false]);
    const { queryAllByText } = render(<ItemsGrid data={[1, 2, 3]} />);

    expect(queryAllByText(/ItemCard/).length).toBe(0);
  });
});
