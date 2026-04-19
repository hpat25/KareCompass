import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the provider map iframe", () => {
  render(<App />);
  expect(screen.getByTitle(/provider map/i)).toBeInTheDocument();
});
