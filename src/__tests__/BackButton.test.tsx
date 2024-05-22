import { render, screen } from "@testing-library/react";
import BackButton from "../components/backButton/BackButton";
import { MemoryRouter } from "react-router-dom";

test("Test back Button", () => {
  render(
    <MemoryRouter>
      <BackButton
        previousPage="Home"
        currentPage="Make Appointment"
        backLink="/"
      />
    </MemoryRouter>
  );
  const linkElement = screen.getByText("Make Appointment");
  expect(linkElement).toBeInTheDocument();
});
