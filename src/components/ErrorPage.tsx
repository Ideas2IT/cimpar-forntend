import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Something went wrong.</h1>
      <p>We're working on getting this fixed as soon as we can.</p>
      <p>
        <Link to="/">Go back to the homepage</Link>
      </p>
    </div>
  );
};

export default ErrorPage;
