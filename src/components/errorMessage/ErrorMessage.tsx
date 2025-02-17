const ErrorMessage = ({ message }: { message?: string }) => {
  return (
    <span className="text-xs text-red-500">{message ?? "Invalid input"}</span>
  );
};
export default ErrorMessage;
