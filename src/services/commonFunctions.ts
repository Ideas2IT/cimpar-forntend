export const getStatusColors = (status = "") => {
  switch (status.toLowerCase()) {
    case "upcoming appointment":
      return "bg-purple-100";
    case "under processing":
      return "bg-orange-400 bg-opacity-20";
    case "available":
      return "bg-green-600 bg-opacity-20";
    default:
      return "";
  }
};
