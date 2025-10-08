// src/App.jsx

import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./router/router";
import "react-datepicker/dist/react-datepicker.css";
import AuthProvider from "./featured/auth/AuthProvider";
import { Toaster } from "react-hot-toast";
import CookieConsent from "react-cookie-consent";

// Custom design colors for a professional look
const PRIMARY_BLUE = "#0056b3"; // Blue for the buttons
const TEXT_RED = "#dc3545"; // Red for the main text

const App = () => {
  // Function to run when the 'Accept All' button is clicked
  const handleAccept = () => {
    // Logic to enable Google Analytics or other tracking scripts goes here
    console.log("User Accepted All cookies. Tracking can be initialized.");
  };

  // Function to run when the 'Reject All' button is clicked
  const handleDecline = () => {
    // Logic to ensure all non-essential tracking scripts are blocked goes here
    console.log("User Rejected All cookies. All tracking remains blocked.");
  };

  return (
    <>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={AppRoutes} />
      </AuthProvider>

      {/* ****************************************************** */}
      {/* Professional CookieConsent Setup (White BG, Light Border, Shadow) */}
      {/* ****************************************************** */}
      <CookieConsent
        location="bottom"
        enableDeclineButton // Enables the 'Reject All' button
        declineButtonText="Reject All"
        buttonText="Accept All"
        cookieName="taxiLogProfessionalConsent"
        expires={365}
        onDecline={handleDecline}
        onAccept={handleAccept}
        // Button styles (Keeping the same professional blue)
        buttonStyle={{
          color: "white",
          fontSize: "15px",
          background: PRIMARY_BLUE,
          borderRadius: "4px",
          marginLeft: "10px",
          padding: "10px 20px",
          fontWeight: "bold",
        }}
        declineButtonStyle={{
          color: "white",
          fontSize: "15px",
          background: PRIMARY_BLUE,
          borderRadius: "4px",
          padding: "10px 20px",
          fontWeight: "bold",
        }}
        // Banner main container style - MODIFIED for White BG, Border, and Shadow
        style={{
          background: "white", // White background
          color: "#333", // Dark text color for contrast
          fontSize: "15px",
          padding: "15px 20px",
          lineHeight: "1.5",
          // Light top border and subtle box shadow for a 'floating' effect
          borderTop: "1px solid #ccc",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Banner Title: Bold */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333", // Ensuring the title is dark on a light background
          }}
        >
          We Value Your Privacy
        </div>

        {/* Main Banner Text: In Red color */}
        <div style={{ color: TEXT_RED, marginBottom: "15px" }}>
          <p className="">
            TaxiLog UK uses cookies to improve your experience. Some are
            essential for site functionality, and others help us improve our
            service. By continuing to use the site, you consent to our use of
            cookies.{" "}
            <span>
              {" "}
              <a
                className="font-[700]"
                href="/taxiLog-cookieSystem"
                style={{
                  color: PRIMARY_BLUE, // Using the primary blue for the link
                  textDecoration: "underline",
                  marginRight: "10px",
                }}
              >
                Cookie Policy
              </a>
            </span>
          </p>
        </div>

        {/* Note: The Accept/Reject buttons are rendered automatically by the component after this content */}
      </CookieConsent>
    </>
  );
};

export default App;
