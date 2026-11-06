import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { PwaInstallPrompt } from "../common/PwaInstallPrompt";

export const AppLayout = () => {
  const location = useLocation();
  const isProfileRoute = location.pathname === "/profile";

  return (
    <div className="min-h-screen">
      <PwaInstallPrompt />
      <div className="app-web-layout">
        <SideNav />
        <div className={isProfileRoute ? "min-w-0 flex-1 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8" : "app-shell"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
