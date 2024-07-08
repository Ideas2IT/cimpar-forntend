import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorPage from "./ErrorPage";

const ErrorFallback = () => {
  return <ErrorPage />;
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Error caught by Error Boundary:", error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
