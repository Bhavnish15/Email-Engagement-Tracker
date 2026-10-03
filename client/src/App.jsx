import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Bell, Menu, Plus } from "lucide-react";

import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";
import ComposeEmail from "@/components/ComposeEmail";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [activePage, setActivePage] = useState("overview");

  const [refreshKey, setRefreshKey] = useState(0);

  const handleEmailSent = () => {
    setRefreshKey((value) => value + 1);

    setActivePage("overview");
  };

  return (
    <div
      className="
        h-screen w-screen
        overflow-hidden
        bg-[#080a0f]
        text-zinc-100
      "
    >
      <div
        className="
          flex h-full
          overflow-hidden
        "
      >
        <AppSidebar activePage={activePage} onPageChange={setActivePage} />

        <main
          className="
            flex min-w-0
            flex-1 flex-col
            overflow-hidden
          "
        >
          <header
            className="
              z-40
              flex h-[72px]
              shrink-0
              items-center
              justify-between
              border-b
              border-white/[0.055]
              bg-[#080a0f]/85
              px-5
              backdrop-blur-xl
              md:px-8
              xl:px-10
            "
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>

              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Email Engagement Tracker
                </p>

                <div
                  className="
                    mt-0.5
                    flex items-center gap-1.5
                  "
                >
                  <span
                    className="
                      size-1.5 rounded-full
                      bg-emerald-400
                    "
                  />

                  <span
                    className="
                      text-[11px]
                      text-zinc-600
                    "
                  >
                    API connected
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="
                  text-zinc-500
                  hover:bg-white/[0.04]
                  hover:text-zinc-200
                "
              >
                <Bell className="size-[18px]" />
              </Button>

              {activePage !== "compose" && (
                <Button
                  onClick={() => setActivePage("compose")}
                  className="
                    bg-violet-600
                    text-white
                    hover:bg-violet-500
                  "
                >
                  <Plus className="mr-2 size-4" />
                  New email
                </Button>
              )}
            </div>
          </header>

          <div
            className="
              min-h-0 flex-1
              overflow-hidden
              px-5 py-5
              md:px-8
              xl:px-10
            "
          >
            <AnimatePresence mode="wait">
              {activePage === "overview" && (
                <motion.div
                  key="overview"
                  initial={{
                    opacity: 0,
                    x: 8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    h-full min-h-0
                  "
                >
                  <Dashboard refreshKey={refreshKey} />
                </motion.div>
              )}

              {activePage === "compose" && (
                <motion.div
                  key="compose"
                  initial={{
                    opacity: 0,
                    x: 8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    h-full min-h-0
                  "
                >
                  <ComposeEmail onEmailSent={handleEmailSent} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}

export default App;
