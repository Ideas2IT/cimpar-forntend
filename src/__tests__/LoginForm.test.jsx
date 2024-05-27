import React from 'react'
import { render, screen } from "@testing-library/react";
import LoginForm from "../components/loginForm/LoginForm";
import { MemoryRouter } from "react-router-dom";

test("Test login form", () => {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    );
    const title = screen.getByText("Login");
    expect(title).toBeInTheDocument();
});

