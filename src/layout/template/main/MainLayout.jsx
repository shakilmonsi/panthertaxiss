import { Outlet, useLocation } from "react-router-dom";
import NavStyle from "./NavStyle";
import FooterStyle from "./FooterStyle";

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register"; // Modify paths as needed

  return (
    <>
      {!isAuthPage && <NavStyle />}
      <main>
        <Outlet />
      </main>
      {!isAuthPage && (
        <footer>
          <FooterStyle />
        </footer>
      )}
    </>
  );
};

export default MainLayout;
