import documentStatusList from "../constants/documentStatusList";

export const documentBackground = (status) => {
  let backgroundColor;
  switch (status) {
    case documentStatusList.incoming:
      backgroundColor = "bg-[#D1E7FF]";
      break;
    case documentStatusList.received:
      backgroundColor = "bg-[#FFD1B3]";
      break;
    case documentStatusList.delayed:
      backgroundColor = "bg-[#D4EDDA]";
      break;
    default:
      break;
  }
  return backgroundColor;
};
