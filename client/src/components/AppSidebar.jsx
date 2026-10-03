import {
  Activity,
  BarChart3,
  MailPlus,
  Send,
  Sparkles,
} from "lucide-react";

const items = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
  },
  {
    id: "compose",
    label: "Compose",
    icon: MailPlus,
  },
//   {
//     id: "activity",
//     label: "Activity",
//     icon: Activity,
//   },
];

export default function AppSidebar({
  activePage,
  onPageChange,
}) {
  return (
    <aside
      className="
        hidden lg:flex
        h-screen w-[248px]
        shrink-0
        flex-col
        border-r border-white/[0.06]
        bg-[#090b11]/90
        px-4 py-5
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-3 px-2">
        <div
          className="
            flex size-10 items-center justify-center
            rounded-xl
            bg-gradient-to-br
            from-violet-500 to-indigo-600
            shadow-lg shadow-violet-500/20
          "
        >
          <Send className="size-5 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight">
              PulseMail
            </span>

            <Sparkles className="size-3.5 text-violet-400" />
          </div>

          <p className="text-xs text-zinc-500">
            Engagement intelligence
          </p>
        </div>
      </div>

      <div className="mt-9 space-y-1">
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-600">
          Workspace
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                group
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm font-medium
                transition-all duration-200
                ${
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200"
                }
              `}
            >
              <Icon
                className={`
                  size-[18px]
                  ${
                    active
                      ? "text-violet-400"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }
                `}
              />

              {item.label}

              {active && (
                <span
                  className="
                    ml-auto size-1.5 rounded-full
                    bg-violet-400
                    shadow-[0_0_10px_rgba(167,139,250,.9)]
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div
          className="
            rounded-2xl
            border border-white/[0.06]
            bg-white/[0.025]
            p-4
          "
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.55)]" />

            <span className="text-xs font-medium text-zinc-300">
              Tracking active
            </span>
          </div>

          <p className="text-xs leading-relaxed text-zinc-600">
            Open signals may be affected by proxies,
            caching, scanners and privacy settings.
          </p>
        </div>
      </div>
    </aside>
  );
}