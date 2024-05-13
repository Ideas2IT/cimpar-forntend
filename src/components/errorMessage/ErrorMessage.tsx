const ErrorMessage = ({ message }: { message?: string }) => {
  return <span className="text-xs text-red-500">{message || "-"}</span>;
};
export default ErrorMessage;
