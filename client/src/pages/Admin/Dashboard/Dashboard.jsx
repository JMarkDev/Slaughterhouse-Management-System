import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getUserData } from "../../../services/authSlice";
const Dashboard = () => {
  const user = useSelector(getUserData);

  return (
    <div className="w-full">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim expedita
      laudantium nulla asperiores aliquid corporis rem neque, porro soluta eos
      accusantium repellat veniam sit placeat facere nam dolorum tempora minima.
    </div>
  );
};

export default Dashboard;
