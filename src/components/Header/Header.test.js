import { render, fireEvent, screen } from "@testing-library/react";
import { fetchMetCollection } from "api/metMusuem";
import Header from "./Header";

jest.mock("api/metMusuem", () => ({
  fetchMetCollection: jest.fn(),
}));

jest.spyOn(window, "addEventListener").mockImplementation();

describe("Header component", () => {
  beforeEach(() => {
    fetchMetCollection.mockClear();
  });

  it("updates the keyword and fetches result when the input is updated", async () => {
    const dummyData = {
      total: 10,
      objectIDs: [1, 2, 3, 4, 5],
    };

    fetchMetCollection.mockResolvedValue(dummyData);

    render(<Header />);

    // Simulate typing into the input field
    const input = screen.getByTestId("searchInput");

    fireEvent.change(input, { target: { value: "test" } });

    const caption = await screen.findByText("10 results for: test");

    expect(caption).toBeInTheDocument();

    expect(fetchMetCollection).toHaveBeenCalled();
  });
});
