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

export const getTestStatusCoor = (start = 0, end = 0, value = 0) => {
  if (value < start || value > end) {
    return "font-bold text-red-500";
  }
  return "";
};



