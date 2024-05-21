import { render, screen } from "@testing-library/react";
import BackButton from "../components/backButton/BackButton";

test("Test back Button", () => {
  render(
    <BackButton
      previousPage="Home"
      currentPage="Make Appointment"
      backLink="/"
    />
  );
  const linkElement = screen.getByText("make Appointment");
  expect(linkElement).toBeInTheDocument();
});
// import { render, screen, fireEvent } from "@testing-library/react";
// import BackButton from "../components/backButton/BackButton";

// describe("back button component", () => {
//   it("should render with provided text", () => {
//     render(
//       <BackButton
//         previousPage="Home"
//         currentPage="Make Appointment"
//         backLink="/"
//       />
//     );
//     expect(screen.getByText("Make Appointment")).toBeInTheDocument();
//   });

//   it("should call onClick when the button is clicked", () => {
//     const handleClick = jest.fn();
//     render(
//       <BackButton
//         previousPage="Home"
//         currentPage="Make Appointment"
//         backLink="/"
//       />
//     );
//     fireEvent.click(screen.getByText(""));
//     expect(handleClick).toHaveBeenCalledTimes(1);
//   });
// });
