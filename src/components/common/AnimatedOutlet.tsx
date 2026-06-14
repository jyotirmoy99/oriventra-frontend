import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FullScreenLoader from "./FullScreenLoader";

// ---------------------------------------------------------------------------
// AnimatedOutlet
// ---------------------------------------------------------------------------
// Drop-in replacement for <Outlet /> that adds a Framer Motion page transition
// (rule (l)) and a Suspense boundary for lazy routes (rule (f)). Keying the
// motion wrapper on the pathname makes AnimatePresence run an exit animation on
// the old page before the new one enters (mode="wait").
//
// Used by every layout so transitions are consistent app-wide and pages don't
// each have to remember to wrap themselves.
// ---------------------------------------------------------------------------

// Subtle fade + slide; respects users who prefer reduced motion via the small
// distance (kept short so it never feels sluggish).
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Lazy route components stream in behind this fallback */}
        <Suspense fallback={<FullScreenLoader />}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
