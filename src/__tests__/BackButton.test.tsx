import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackButton from "../components/backButton/BackButton";
import "@testing-library/jest-dom";

describe("BackButton Component", () => {
  const previousPage = "Previous Page";
  const currentPage = "Current Page";
  const backLink = "/previous";

  beforeEach(() => {
    render(
      <MemoryRouter>
        <BackButton
          previousPage={previousPage}
          currentPage={currentPage}
          backLink={backLink}
        />
      </MemoryRouter>
    );
  });

  test("renders BackButton component", () => {
    expect(screen.getByText(previousPage)).toBeInTheDocument();
    expect(screen.getByText(`/${currentPage}`)).toBeInTheDocument();
  });

  test("navigates to the correct back link", () => {
    const linkElement = screen.getByRole("link", { name: previousPage });
    expect(linkElement).toHaveAttribute("href", backLink);
  });

  test("displays the previous page label", () => {
    expect(screen.getByText(previousPage)).toBeInTheDocument();
  });

  test("displays the current page label", () => {
    expect(screen.getByText(`/${currentPage}`)).toBeInTheDocument();
  });

  test("renders the button with correct properties", () => {
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveClass("p-2 bg-white shadow-none rounded-md");
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders the icon inside the button", () => {
    const iconElement = screen
      .getByRole("button")
      .querySelector(".pi.pi-arrow-left");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass("color-primary");
  });

  test("renders the previous page label with correct classes", () => {
    const labelElement = screen.getByText(previousPage);
    expect(labelElement).toHaveClass(
      "text-blue-200 font-primary lg:text-xl md:text-md sm:text-sm cursor-pointer px-1"
    );
  });

  test("renders the current page label with correct classes", () => {
    const currentPageElement = screen.getByText(`/${currentPage}`);
    expect(currentPageElement).toHaveClass(
      "color-primary font-primary md:block px-1 lg:text-xl md:text-md sm:text-sm"
    );
  });
});
