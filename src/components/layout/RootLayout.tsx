import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar will go here */}
      <main>
        <Outlet />
      </main>
      {/* Footer will go here */}
    </div>
  );
};

export default RootLayout;
