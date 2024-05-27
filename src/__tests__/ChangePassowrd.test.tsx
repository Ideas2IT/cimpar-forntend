import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChangePassword from "../components/changePassword/ChangePassword";

test("Test login change Password", () => {
  render(
    <MemoryRouter>
      <ChangePassword handleClose={() => {}} />
    </MemoryRouter>
  );
  const title = screen.getByText("Change Password");
  expect(title).toBeInTheDocument();
});
