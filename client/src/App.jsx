import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import rolesList from "./constants/rolesList";
// import { UseAutoLogout } from "./hooks/UseAutoLogout";

import ProtectedRoute from "./route/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

import UserProfile from "./pages/Shared/UserProfile";
import UserDetails from "./pages/Shared/UserDetails";

import Homepage from "./pages/Homepage";
import LayoutDashboard from "./components/layout/LayoutDashboard";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Transaction from "./pages/Admin/Transaction/Transaction";
import Cattle from "./pages/Admin/AnimalRecords/Cattle/Cattle";
import Pigs from "./pages/Admin/AnimalRecords/Pigs/Pigs";
import Goats from "./pages/Admin/AnimalRecords/Goats/Goats";

import CityAdmin from "./pages/Admin/UserManagement/CityAdmin/CityAdmin";
import SlaughterhouseUser from "./pages/Admin/UserManagement/Slaughterhouse/SlaughterhouseUsers";

import SlaughterhouseRecords from "./pages/Admin/SlaughterhouseRecords/SlaughterhouseRecords";
import Reports from "./pages/Admin/Reports/Reports";

function App() {
  // logout user after 30 minutes of inactivity
  // UseAutoLogout();

  const adminLinks = [
    { title: "Dashboard", path: "/admin-dashboard", component: <Dashboard /> },
    {
      title: "Slaughterhouse",
      path: "/slaughterhouse-records",
      component: <SlaughterhouseRecords />,
    },
    { title: "Transaction", path: "/transaction", component: <Transaction /> },
    { title: "Cattle", path: "/cattle", component: <Cattle /> },
    { title: "Pigs", path: "/pigs", component: <Pigs /> },
    { title: "Goats", path: "/goats", component: <Goats /> },
    { title: "City Admin", path: "/admin", component: <CityAdmin /> },
    {
      title: "Slaughterhouse User",
      path: "/supervisor",
      component: <SlaughterhouseUser />,
    },
    { title: "Reports", path: "/reports", component: <Reports /> },
  ];

  const slaughterhouseLinks = [
    {
      title: "Dashboard",
      path: "/slaughterhouse-dashboard",
      component: <Dashboard />,
    },
    {
      title: "Transaction",
      path: "/slaughterhouse-transaction",
      component: <Transaction />,
    },
    { title: "Cattle", path: "/slaughterhouse-cattle", component: <Cattle /> },
    { title: "Pigs", path: "/slaughterhouse-pigs", component: <Pigs /> },
    { title: "Goats", path: "/slaughterhouse-goats", component: <Goats /> },
    {
      title: "Reports",
      path: "/slaughterhouse-reports",
      component: <Reports />,
    },
  ];

  const sharedLinks = [
    {
      title: "User Profile",
      path: "/user-profile",
      component: <UserProfile />,
    },
    {
      title: "User Details",
      path: "/user-details/:id",
      component: <UserDetails />,
    },
  ];

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />

        {adminLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin]}
              />
            }
          />
        ))}

        {slaughterhouseLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.supervisor]}
              />
            }
          />
        ))}

        {sharedLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin, rolesList.supervisor]}
              />
            }
          />
        ))}

        {/* Not found page */}
        {/* <Route path="/scan-qr-code" element={<Scanner />} /> */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;