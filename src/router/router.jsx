import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/template/main/MainLayout";
import HomeView from "../pages/public/home/HomeView.jsx";
import Features from "../pages/public/Features/Features.jsx";
import RegisterView from "../pages/auth/register/RegisterView";
import LoginView from "../pages/auth/login/LoginView";
import DashboardLayout from "../layout/template/admin/DashboardLayout";
import Dashboard from "../pages/private/dashboard/Dashboard";
import UsefulLinksManagement from "../pages/private/UsefulLinksManagement/UsefulLinksManagement.jsx";
import Documents from "../pages/private/Documents/Documents.jsx";
import Settings from "../pages/private/Settings/Settings.jsx";
import Records from "../pages/private/Records/Records.jsx";
import UserManagement from "../pages/private/dashboard/UserManagement.jsx";
import AddUserForm from "../pages/private/dashboard/AddUserForm/AddUserForm.jsx";
import VehicleInspectionForm from "../pages/private/dashboard/VehicleInspectionForm/VehicleInspectionForm.jsx";
import UserDashboardLayout from "../layout/template/user/UserDashboardLayout/UserDashboardLayout.jsx";
import { UserLink } from "./../pages/private/UserDashboard/components/UserLink";
import { UserHistory } from "../pages/private/UserDashboard/components/UserHistory.jsx";
import { UserDocument } from "../pages/private/UserDashboard/components/UserDocument.jsx";
import { User } from "../pages/private/UserDashboard/components/User.jsx";
import TaxiLogCookieSystem from "../pages/public/cookiePolicy/CookiePolicy.jsx";
import PrivacyPolicy from "../pages/public/privacyPolicy/PrivacyPolicy.jsx";
import TermsOfService from "../pages/public/termsofService/TermsofService.jsx";

import NotFoundView from "../pages/error/NotFoundView.jsx";
import {
  PrivateRoute,
  PrivateAdminRoute,
} from "./PrivateRoute.jsx/PrivateRoute.jsx";
import AboutUs from "../pages/about/AboutUs.jsx";
import ContactUs from "../pages/contact/ContactUs.jsx";
import UserSeting from "../pages/private/Settings/userSeting/UserSeting.jsx";
import FeaturesSection from "../pages/public/Features/Features.jsx";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      { path: "/features", element: <Features /> },

      // { path: "/testimonials", element: <Testimonials /> },
      // { path: "/faq", element: <Faq /> },

      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },

      {
        path: "/taxiLog-cookieSystem",
        element: <TaxiLogCookieSystem />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },

      {
        path: "features",
        element: <FeaturesSection />,
      },
      {
        path: "/termsOf-service",
        element: <TermsOfService />,
      },
      {
        path: "/login",
        element: <LoginView />,
      },
      {
        path: "/register",
        element: <RegisterView />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateAdminRoute>
        <DashboardLayout />
      </PrivateAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "links",
        element: <UsefulLinksManagement />,
      },
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "records",
        element: <Records />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "add-user",
        element: <AddUserForm />,
      },
      {
        path: "vehicle-inspection",
        element: <VehicleInspectionForm />,
      },
    ],
  },
  {
    path: "/user-dashboard",
    element: (
      <PrivateRoute>
        <UserDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "history",
        element: <UserHistory />,
      },
      {
        path: "documents",
        element: <UserDocument />,
      },
      {
        path: "links",
        element: <UserLink />,
      },
      {
        path: "dasboard-seting",
        element: <UserSeting />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
]);

export { AppRoutes };
