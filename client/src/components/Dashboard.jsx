import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  Activity,
  Eye,
  Mail,
  MousePointerClick,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { getEmails } from "@/api/api";

import StatCard from "@/components/StatCard";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard({ refreshKey }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadEmails = async (manual = false) => {
    try {
      manual ? setRefreshing(true) : setLoading(true);

      setError("");

      const response = await getEmails();

      setEmails(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, [refreshKey]);

  const rows = useMemo(() => {
    return emails.flatMap((email) =>
      email.recipients.map((recipient) => {
        const events = recipient.openEvents || [];

        const sorted = [...events].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );

        const clicks =
          recipient.trackedLinks?.reduce(
            (total, link) => total + (link.clickEvents?.length || 0),
            0,
          ) || 0;

        const proxyCount = events.filter(
          (event) => event.classification === "PROXY_OR_SCANNER",
        ).length;

        const humanLikeCount = events.filter(
          (event) => event.classification === "HUMAN_LIKE",
        ).length;

        return {
          id: recipient.id,

          subject: email.subject,

          recipient: recipient.emailAddress,

          sentAt: recipient.sentAt,

          openCount: events.length,

          firstOpen: sorted[0]?.timestamp || null,

          lastOpen: sorted.at(-1)?.timestamp || null,

          clicks,

          proxyCount,

          humanLikeCount,

          detected: events.length > 0,
        };
      }),
    );
  }, [emails]);

  const metrics = useMemo(() => {
    return {
      sent: rows.length,

      openSignals: rows.filter((row) => row.detected).length,

      clicks: rows.reduce((sum, row) => sum + row.clicks, 0),

      proxy: rows.reduce((sum, row) => sum + row.proxyCount, 0),
    };
  }, [rows]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
            flex shrink-0
            flex-col gap-4
            xl:flex-row
            xl:items-end
            xl:justify-between
        "
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Activity className="size-4 text-violet-400" />

            <span className="text-xs font-medium uppercase tracking-[0.16em] text-violet-400">
              Live analytics
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Email engagement
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Monitor delivery and observed engagement signals without treating
            image requests as guaranteed human activity.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => loadEmails(true)}
          disabled={refreshing}
          className="
            border-white/[0.08]
            bg-white/[0.025]
            text-zinc-300
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <RefreshCw
            className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <div
        className="
            grid shrink-0
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
        "
      >
        <StatCard
          label="Recipients sent"
          value={metrics.sent}
          description="Successful recipient deliveries"
          icon={Mail}
          accent="violet"
          delay={0}
        />

        <StatCard
          label="Open signals"
          value={metrics.openSignals}
          description="Recipients with observed image requests"
          icon={Eye}
          accent="blue"
          delay={0.06}
        />

        <StatCard
          label="Tracked clicks"
          value={metrics.clicks}
          description="Confirmed link interactions"
          icon={MousePointerClick}
          accent="emerald"
          delay={0.12}
        />

        <StatCard
          label="Proxy signals"
          value={metrics.proxy}
          description="Events likely generated automatically"
          icon={ShieldAlert}
          accent="amber"
          delay={0.18}
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
    min-h-0 flex-1
    overflow-hidden
  "
      >
        <Card
          className="
      flex h-full min-h-0
      flex-col
      overflow-hidden
      border-white/[0.065]
      bg-[#0d1017]/90
    "
        >
          <CardHeader
            className="
                shrink-0
                border-b
                border-white/[0.055]
                px-6 py-4
            "
          >
            <div
              className="
                flex h-full min-h-0
                flex-col gap-5
                overflow-hidden
              "
            >
              <h2 className="text-base font-semibold text-zinc-100">
                Recent activity
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Per-recipient engagement signals
              </p>
            </div>

            <Badge
              variant="outline"
              className="
                border-white/[0.08]
                bg-white/[0.025]
                text-zinc-500
              "
            >
              {rows.length} recipients
            </Badge>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <RefreshCw className="size-5 animate-spin text-violet-400" />
              </div>
            ) : error ? (
              <div className="p-8 text-sm text-red-400">{error}</div>
            ) : rows.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center">
                <div
                  className="
                    mb-4 flex size-12
                    items-center justify-center
                    rounded-2xl
                    border border-white/[0.06]
                    bg-white/[0.025]
                  "
                >
                  <Mail className="size-5 text-zinc-600" />
                </div>

                <p className="font-medium text-zinc-300">No campaigns yet</p>

                <p className="mt-1 text-sm text-zinc-600">
                  Send your first tracked email.
                </p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.055] hover:bg-transparent">
                      <TableHead className="pl-6 text-zinc-600">Recipient</TableHead>

                      <TableHead className="text-zinc-600">Subject</TableHead>

                      <TableHead className="text-zinc-600">Signal</TableHead>

                      <TableHead className="text-zinc-600">First observed</TableHead>

                      <TableHead className="text-zinc-600">Opens</TableHead>

                      <TableHead className="text-zinc-600">Dwell</TableHead>

                      <TableHead className="text-zinc-600">Clicks</TableHead>

                      <TableHead className="pr-6 text-zinc-600">Sent</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="
                          border-white/[0.045]
                          transition-colors
                          hover:bg-white/[0.025]
                        "
                      >
                        <TableCell className="pl-6">
                          <div>
                            <p className="font-medium text-zinc-200">
                              {row.recipient}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              Recipient
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-[230px]">
                          <p className="truncate text-zinc-400">
                            {row.subject}
                          </p>
                        </TableCell>

                        <TableCell>
                          {row.proxyCount > 0 ? (
                            <Badge
                              className="
                                border border-amber-500/20
                                bg-amber-500/10
                                text-amber-300
                                hover:bg-amber-500/10
                              "
                            >
                              Proxy suspected
                            </Badge>
                          ) : row.detected ? (
                            <Badge
                              className="
                                border border-emerald-500/20
                                bg-emerald-500/10
                                text-emerald-300
                                hover:bg-emerald-500/10
                              "
                            >
                              Signal detected
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="
                                border-white/[0.08]
                                text-zinc-600
                              "
                            >
                              No signal
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-zinc-500">
                          {formatDate(row.firstOpen)}
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-zinc-300">
                            {row.openCount}
                          </span>
                        </TableCell>

                        <TableCell className="text-zinc-500">
                          {row.estimatedDwellSeconds
                            ? <span className="font-medium text-zinc-300">`~${row.estimatedDwellSeconds}s`</span>
                            : "Unknown"}
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-zinc-300">
                            {row.clicks}
                          </span>
                        </TableCell>

                        <TableCell className="pr-6 text-zinc-500">
                          {formatDate(row.sentAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
