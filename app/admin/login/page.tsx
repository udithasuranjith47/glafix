"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Loader2, Eye, EyeOff, Mail, KeyRound,
  ArrowLeft, CheckCircle,
} from "lucide-react";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ─── Schemas ──────────────────────────────────────────── */

const passwordSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

const emailOnlySchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type EmailOnlyForm = z.infer<typeof emailOnlySchema>;

/* ─── Page state types ─────────────────────────────────── */

type Mode = "password" | "magic";
type State = "form" | "link-sent" | "link-confirm" | "completing";

/* ─── Component ────────────────────────────────────────── */

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("password");
  const [pageState, setPageState] = useState<State>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  /* Password form */
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: errPwd, isSubmitting: submittingPwd },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  /* Magic-link "send" form */
  const {
    register: regMagic,
    handleSubmit: handleMagic,
    formState: { errors: errMagic, isSubmitting: submittingMagic },
  } = useForm<EmailOnlyForm>({ resolver: zodResolver(emailOnlySchema) });

  /* Magic-link "confirm on different device" form */
  const {
    register: regConfirm,
    handleSubmit: handleConfirm,
    formState: { errors: errConfirm, isSubmitting: submittingConfirm },
  } = useForm<EmailOnlyForm>({ resolver: zodResolver(emailOnlySchema) });

  /* ── On load: detect if this is a magic-link callback ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    const saved = localStorage.getItem("emailForSignIn");
    if (saved) {
      completeMagicSignIn(saved, window.location.href);
    } else {
      setPageState("link-confirm");
    }
  }, []);

  /* ── Complete magic-link sign-in ────────────────────── */
  async function completeMagicSignIn(email: string, link: string) {
    setPageState("completing");
    try {
      const credential = await signInWithEmailLink(auth, email, link);
      localStorage.removeItem("emailForSignIn");
      const token = await credential.user.getIdToken();
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict${secure}`;
      toast.success("Signed in successfully");
      const redirect = searchParams.get("redirect") ?? "/admin/dashboard";
      router.push(redirect);
    } catch {
      toast.error("Link is invalid or expired. Please request a new one.");
      setPageState("form");
      setMode("magic");
    }
  }

  /* ── Password sign-in ───────────────────────────────── */
  async function onPasswordSubmit(data: PasswordForm) {
    try {
      await signIn(data.email, data.password);
      toast.success("Welcome back");
      router.push(searchParams.get("redirect") ?? "/admin/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  }

  /* ── Send magic link ────────────────────────────────── */
  async function onSendLink(data: EmailOnlyForm) {
    const actionCodeSettings = {
      url: `${window.location.origin}/admin/login`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", data.email);
      setSentToEmail(data.email);
      setPageState("link-sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("auth/unauthorized-continue-uri") || msg.includes("UNAUTHORIZED_DOMAIN")) {
        toast.error(
          "Add this domain to Firebase → Authentication → Settings → Authorized domains."
        );
      } else if (msg.includes("CONFIGURATION_NOT_FOUND") || msg.includes("operation-not-allowed")) {
        toast.error(
          "Enable 'Email link (passwordless)' in Firebase → Authentication → Sign-in method."
        );
      } else {
        toast.error("Failed to send link. Check Firebase console settings.");
      }
    }
  }

  /* ── Confirm email (different device) ──────────────── */
  async function onConfirmEmail(data: EmailOnlyForm) {
    await completeMagicSignIn(data.email, window.location.href);
  }

  /* ─────────────────────────────────────────────────── */
  /* Render                                              */
  /* ─────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, oklch(0.769 0.188 70.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <Logo size={48} />
          </div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Glafix
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Access</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">

          {/* ── COMPLETING ──────────────────────────────── */}
          {pageState === "completing" && (
            <div className="p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Signing you in…</p>
            </div>
          )}

          {/* ── LINK SENT ───────────────────────────────── */}
          {pageState === "link-sent" && (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-1">
                  Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a sign-in link to{" "}
                  <span className="text-foreground font-medium">{sentToEmail}</span>.
                  Click the link in the email to sign in — no password needed.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                The link expires in 1 hour.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-1.5"
                onClick={() => { setPageState("form"); setMode("magic"); }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Use a different email
              </Button>
            </div>
          )}

          {/* ── LINK CONFIRM (different device) ─────────── */}
          {pageState === "link-confirm" && (
            <div className="p-8 space-y-5">
              <div>
                <h2 className="font-semibold text-foreground mb-1">Confirm your email</h2>
                <p className="text-sm text-muted-foreground">
                  Looks like you opened the link on a different device. Enter the
                  email you used to request the link.
                </p>
              </div>
              <form onSubmit={handleConfirm(onConfirmEmail)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="confirm-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...regConfirm("email")}
                    className="bg-muted/20 border-border focus:border-primary/50"
                  />
                  {errConfirm.email && (
                    <p className="text-destructive text-xs">{errConfirm.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={submittingConfirm}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submittingConfirm && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Complete Sign In
                </Button>
              </form>
            </div>
          )}

          {/* ── FORM (password / magic) ──────────────────── */}
          {pageState === "form" && (
            <>
              {/* Mode tabs */}
              <div className="grid grid-cols-2 border-b border-border">
                <button
                  type="button"
                  onClick={() => setMode("password")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors",
                    mode === "password"
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors",
                    mode === "magic"
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Magic Link
                </button>
              </div>

              <div className="p-8">
                {/* PASSWORD form */}
                {mode === "password" && (
                  <form onSubmit={handlePwd(onPasswordSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        {...regPwd("email")}
                        className="bg-muted/20 border-border focus:border-primary/50"
                      />
                      {errPwd.email && (
                        <p className="text-destructive text-xs">{errPwd.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          {...regPwd("password")}
                          className="bg-muted/20 border-border focus:border-primary/50 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errPwd.password && (
                        <p className="text-destructive text-xs">{errPwd.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submittingPwd}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {submittingPwd && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                )}

                {/* MAGIC LINK form */}
                {mode === "magic" && (
                  <form onSubmit={handleMagic(onSendLink)} className="space-y-5">
                    <p className="text-sm text-muted-foreground leading-relaxed -mt-1">
                      Enter your email and we&apos;ll send a one-click sign-in link.
                      No password required.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="magic-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="magic-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        {...regMagic("email")}
                        className="bg-muted/20 border-border focus:border-primary/50"
                      />
                      {errMagic.email && (
                        <p className="text-destructive text-xs">{errMagic.email.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submittingMagic}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    >
                      {submittingMagic
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Mail className="w-4 h-4" />
                      }
                      {submittingMagic ? "Sending…" : "Send Magic Link"}
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
