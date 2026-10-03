import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

import {
  Code2,
  Mail,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { createEmail } from "@/api/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function ComposeEmail({
  onEmailSent,
}) {
  const [recipients, setRecipients] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [bodyHtml, setBodyHtml] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const recipientList = recipients
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter(Boolean);

    if (recipientList.length === 0) {
      toast.error(
        "Enter at least one recipient."
      );
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject is required.");
      return;
    }

    if (!bodyHtml.trim()) {
      toast.error("Email body is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        recipients: recipientList,
        subject: subject.trim(),
        bodyHtml,
      };

      console.log(
        "Sending email payload:",
        payload
      );

      const response =
        await createEmail(payload);

      console.log(
        "Email API response:",
        response
      );

      toast.success(
        response.message ||
          "Email sent successfully"
      );

      setRecipients("");
      setSubject("");
      setBodyHtml("");

      onEmailSent?.();
    } catch (error) {
      console.error(
        "Send email failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to send email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        mx-auto
        flex h-full min-h-0
        w-full max-w-5xl
        flex-col
      "
    >
      <div className="mb-5 shrink-0">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-4 text-violet-400" />

          <span
            className="
              text-xs font-medium
              uppercase tracking-[0.16em]
              text-violet-400
            "
          >
            New campaign
          </span>
        </div>

        <h1
          className="
            text-3xl font-semibold
            tracking-tight
            text-zinc-100
          "
        >
          Compose email
        </h1>

        <p className="mt-1.5 text-sm text-zinc-500">
          Send an individually tracked message
          to one or more recipients.
        </p>
      </div>

      <Card
        className="
          flex min-h-0 flex-1
          flex-col overflow-hidden
          border-white/[0.065]
          bg-[#0d1017]/90
          shadow-[0_20px_60px_rgba(0,0,0,.22)]
        "
      >
        <CardHeader
          className="
            shrink-0
            border-b border-white/[0.055]
            px-7 py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex size-9
                items-center justify-center
                rounded-xl
                bg-violet-500/10
                text-violet-400
              "
            >
              <Mail className="size-[17px]" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Message details
              </p>

              <p className="text-xs text-zinc-600">
                HTML content is supported
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent
          className="
            min-h-0 flex-1
            overflow-hidden
            p-6
          "
        >
          <form
            onSubmit={handleSubmit}
            className="
              grid h-full min-h-0
              grid-rows-[auto_auto_minmax(0,1fr)_auto]
              gap-5
            "
          >
            <div>
              <label
                className="
                  mb-2 flex items-center gap-2
                  text-sm font-medium
                  text-zinc-400
                "
              >
                <Users className="size-4 text-zinc-600" />
                Recipients
              </label>

              <Input
                value={recipients}
                onChange={(event) =>
                  setRecipients(
                    event.target.value
                  )
                }
                placeholder="name@example.com, another@example.com"
                className="
                  h-11
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-zinc-200
                  placeholder:text-zinc-700
                  focus-visible:ring-violet-500/40
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-zinc-400
                "
              >
                Subject
              </label>

              <Input
                value={subject}
                onChange={(event) =>
                  setSubject(
                    event.target.value
                  )
                }
                placeholder="What is this email about?"
                className="
                  h-11
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-zinc-200
                  placeholder:text-zinc-700
                  focus-visible:ring-violet-500/40
                "
              />
            </div>

            <div
              className="
                flex min-h-0
                flex-col
              "
            >
              <label
                className="
                  mb-2 flex
                  shrink-0 items-center
                  justify-between
                  text-sm font-medium
                  text-zinc-400
                "
              >
                <span className="flex items-center gap-2">
                  <Code2 className="size-4 text-zinc-600" />

                  Email body
                </span>

                <span
                  className="
                    text-xs font-normal
                    text-zinc-700
                  "
                >
                  HTML
                </span>
              </label>

              <Textarea
                value={bodyHtml}
                onChange={(event) =>
                  setBodyHtml(
                    event.target.value
                  )
                }
                placeholder={`<h1>Hello!</h1>\n<p>Your message...</p>`}
                className="
                  h-full min-h-[140px]
                  flex-1 resize-none
                  border-white/[0.07]
                  bg-[#090b10]
                  font-mono text-[13px]
                  leading-6
                  text-zinc-300
                  placeholder:text-zinc-800
                  focus-visible:ring-violet-500/40
                "
              />
            </div>

            <div
              className="
                flex shrink-0
                items-center justify-between
                border-t
                border-white/[0.055]
                pt-5
              "
            >
              <p
                className="
                  hidden text-xs
                  text-zinc-700
                  sm:block
                "
              >
                Each recipient receives a unique
                tracking token.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="
                  ml-auto h-11
                  min-w-[145px]
                  bg-violet-600
                  px-6
                  text-white
                  shadow-lg
                  shadow-violet-600/15
                  transition-all
                  hover:bg-violet-500
                  active:scale-[0.98]
                "
              >
                <Send className="mr-2 size-4" />

                {loading
                  ? "Sending..."
                  : "Send email"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}