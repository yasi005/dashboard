"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Cog, Lock, Mail, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { isAuthenticated, setAuthenticated } from "@/components/auth/auth-gate";
import {
  DEMO_GUEST,
  ensureDemoGuest,
  registerOperator,
  validateEmail,
  validateOperatorLogin,
  validatePassword,
  validateUsername,
} from "@/lib/auth-store";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";
type CardPhase = "form" | "provisioning" | "success" | "authorizing";

const PROVISION_LOGS = [
  "ALLOCATING SECURE DATABASE SECTOR…",
  "ENCRYPTING CIPHER VAULT…",
  "REGISTERING CONSOLE NODE…",
  "[OK]",
];

const AUTH_TELEMETRY = [
  "SYS: Handshaking with secure local memory layer…",
  "SYS: Matching cipher keys… [MATCH SUCCESS]",
  "SYS: Allocating ephemeral dashboard view token…",
];

async function typewriter(
  text: string,
  setter: (v: string) => void,
  msPerChar = 32
): Promise<void> {
  setter("");
  for (let i = 1; i <= text.length; i++) {
    setter(text.slice(0, i));
    await new Promise((r) => setTimeout(r, msPerChar));
  }
}

function AuthField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  fieldKey,
  focused,
  onFocus,
  onBlur,
  disabled,
}: {
  label: string;
  icon: typeof User;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  fieldKey: string;
  focused: string | null;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
}) {
  const isFocused = focused === fieldKey;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={spring.card}
    >
      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4E4E7]/35" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={type === "password" ? "current-password" : undefined}
          className={cn(
            "w-full border bg-[#080808] py-3.5 pl-10 pr-4 font-mono text-sm text-[#E4E4E7] placeholder:text-[#E4E4E7]/25 transition-all touch-target disabled:opacity-60",
            isFocused
              ? "border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              : "border-[#242424]"
          )}
        />
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [phase, setPhase] = useState<CardPhase>("form");
  const [shake, setShake] = useState(false);
  const [cardExit, setCardExit] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [autofilling, setAutofilling] = useState(false);
  const [authLogIndex, setAuthLogIndex] = useState(0);
  const [provisionLog, setProvisionLog] = useState(0);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    ensureDemoGuest();
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const triggerReject = useCallback(() => {
    setShake(true);
    toast.error("CRITICAL: INVALID CIPHER PARAMS", {
      description: "Mechanical rejection — verify your credentials and retry.",
    });
    setTimeout(() => setShake(false), 450);
  }, []);

  const runAuthorizeSequence = useCallback(
    async (operatorName: string) => {
      setPhase("authorizing");
      setAuthLogIndex(0);

      for (let i = 0; i < AUTH_TELEMETRY.length; i++) {
        setAuthLogIndex(i);
        await new Promise((r) => setTimeout(r, 400));
      }

      await new Promise((r) => setTimeout(r, 200));
      setCardExit(true);
      await new Promise((r) => setTimeout(r, 500));

      setAuthenticated(operatorName);
      router.push("/dashboard");
    },
    [router]
  );

  const runProvisionSequence = useCallback(async (newUsername: string) => {
    setPhase("provisioning");
    setProvisionLog(0);

    for (let i = 0; i < PROVISION_LOGS.length; i++) {
      setProvisionLog(i);
      await new Promise((r) => setTimeout(r, 200));
    }
    await new Promise((r) => setTimeout(r, 200));

    setPhase("success");
    await new Promise((r) => setTimeout(r, 600));

    setPhase("form");
    setMode("signin");
    setUsername(newUsername);
    setPassword("");
    setEmail("");
    toast.success("Console node registered", {
      description: `Operator ${newUsername} allocated. Establish connection.`,
    });
  }, []);

  const autofillGuestCredentials = useCallback(async () => {
    setAutofilling(true);
    setMode("signin");
    setFocused("username");
    await typewriter(DEMO_GUEST.username, setUsername);
    setFocused("password");
    await typewriter(DEMO_GUEST.password, setPassword);
    setFocused(null);
    setAutofilling(false);
  }, []);

  const handleUseGuestCredentials = async () => {
    if (autofilling || phase !== "form") return;
    await autofillGuestCredentials();
  };

  const handleOneClickDemo = async () => {
    if (autofilling || phase !== "form") return;
    await autofillGuestCredentials();
    await runAuthorizeSequence(DEMO_GUEST.username);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "form" || autofilling) return;

    const userErr = validateUsername(username);
    const passErr = validatePassword(password);
    if (userErr || passErr) {
      triggerReject();
      return;
    }

    if (!validateOperatorLogin(username, password)) {
      triggerReject();
      return;
    }

    await runAuthorizeSequence(username.trim());
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const userErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (userErr || emailErr || passErr) {
      triggerReject();
      return;
    }

    const result = registerOperator({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      triggerReject();
      toast.error("CRITICAL: NODE COLLISION", { description: result.reason });
      return;
    }

    await runProvisionSequence(username.trim());
  };

  const formLocked = phase !== "form" || autofilling;

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#080808] flex items-center justify-center sm:p-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#E4E4E7 1px, transparent 1px),
            linear-gradient(90deg, #E4E4E7 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_60%)]" />

      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: cardExit ? 0 : 1,
          y: cardExit ? -20 : 0,
          scale: cardExit ? 1.04 : 1,
          x: shake ? [0, -12, 12, -8, 8, -4, 4, 0] : 0,
        }}
        transition={
          cardExit
            ? { duration: 0.45, ease: "easeIn" }
            : shake
              ? { duration: 0.45 }
              : { type: "spring", stiffness: 200, damping: 24 }
        }
        className={cn(
          "relative w-full sm:max-w-md border border-[#242424] bg-[#141414]",
          "min-h-[100dvh] sm:min-h-0 flex flex-col justify-center",
          "p-6 sm:p-8 rounded-none sm:rounded-xl",
          "sm:shadow-[0_0_48px_rgba(245,158,11,0.06)]"
        )}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#242424] bg-[#080808]">
            <Cog className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#E4E4E7] tracking-tight">
              EchoSaaS <span className="text-[#E4E4E7]/35">//</span> Σ
            </h1>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">
              Machined Access Gateway
            </p>
          </div>
        </div>

        {/* Demo access block */}
        {phase === "form" && (
          <div className="mb-5 rounded-lg border border-[#242424] bg-[#080808] p-3">
            <p className="text-[10px] font-mono text-[#E4E4E7]/40 leading-relaxed">
              <span className="text-[#F59E0B]/80">DEMO_ACCESS_KEY:</span> username:{" "}
              <span className="text-[#E4E4E7]/70">{DEMO_GUEST.username}</span>
              {" // "}cipher: <span className="text-[#E4E4E7]/70">{DEMO_GUEST.password}</span>
            </p>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleUseGuestCredentials}
                disabled={autofilling}
                className="touch-target flex-1 rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#F59E0B] hover:bg-[#F59E0B]/15 transition-colors disabled:opacity-50"
              >
                Use Guest Credentials
              </button>
              <button
                type="button"
                onClick={handleOneClickDemo}
                disabled={autofilling}
                className="touch-target flex-1 flex items-center justify-center gap-1.5 rounded-md bg-[#F59E0B] px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#080808] hover:bg-[#D97706] transition-colors disabled:opacity-50"
              >
                <Zap className="h-3 w-3" />
                Enter Demo Console
              </button>
            </div>
          </div>
        )}

        <div className="relative flex border-b border-[#242424] mb-6">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                if (!formLocked) setMode(m);
              }}
              disabled={formLocked}
              className={cn(
                "relative flex-1 py-2.5 text-[10px] uppercase tracking-[0.14em] font-mono transition-colors touch-target",
                mode === m ? "text-[#E4E4E7]" : "text-[#E4E4E7]/40",
                formLocked && "opacity-50"
              )}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
              {mode === m && phase === "form" && (
                <motion.div
                  layoutId="auth-mode-underline"
                  className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  transition={spring.switch}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.form
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={spring.structural}
              onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {mode === "signin" ? (
                  <>
                    <AuthField
                      key="si-user"
                      label="Operator Username"
                      icon={User}
                      value={username}
                      onChange={setUsername}
                      placeholder="operator_01"
                      fieldKey="username"
                      focused={focused}
                      onFocus={() => setFocused("username")}
                      onBlur={() => setFocused(null)}
                      disabled={autofilling}
                    />
                    <AuthField
                      key="si-pass"
                      label="Security Cipher (Password)"
                      icon={Lock}
                      type="password"
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••••••"
                      fieldKey="password"
                      focused={focused}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      disabled={autofilling}
                    />
                  </>
                ) : (
                  <>
                    <AuthField
                      key="su-user"
                      label="Choose Operator Username"
                      icon={User}
                      value={username}
                      onChange={setUsername}
                      placeholder="yasy_dev"
                      fieldKey="username"
                      focused={focused}
                      onFocus={() => setFocused("username")}
                      onBlur={() => setFocused(null)}
                    />
                    <AuthField
                      key="su-email"
                      label="Register Companion Email"
                      icon={Mail}
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="operator@yazmin.dev"
                      fieldKey="email"
                      focused={focused}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                    />
                    <AuthField
                      key="su-pass"
                      label="Generate Security Cipher"
                      icon={Lock}
                      type="password"
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••••••"
                      fieldKey="password"
                      focused={focused}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                    />
                  </>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={formLocked}
                className={cn(
                  "touch-target w-full bg-[#F59E0B] py-4 text-sm font-bold text-[#080808] tracking-wide transition-all mt-2",
                  "hover:bg-[#D97706] shadow-[0_0_20px_rgba(245,158,11,0.2)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {autofilling
                  ? "INJECTING CREDENTIALS…"
                  : mode === "signin"
                    ? "ESTABLISH CONNECTION →"
                    : "REGISTER NEW CONSOLE NODE"}
              </button>

              <p className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  disabled={formLocked}
                  className="text-[10px] font-mono text-[#E4E4E7]/40 hover:text-[#F59E0B] transition-colors touch-target py-2 disabled:opacity-50"
                >
                  {mode === "signin"
                    ? "New Node? Initiate Registration (Sign Up)"
                    : "Already Authorized? Return to Sign In"}
                </button>
              </p>
            </motion.form>
          )}

          {phase === "authorizing" && (
            <motion.div
              key="authorizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                className="h-12 w-12 rounded-full border-2 border-[#242424] border-t-[#F59E0B]"
              />
              <p className="text-xs font-mono text-[#F59E0B] uppercase tracking-widest">
                Establishing Connection
              </p>
            </motion.div>
          )}

          {phase === "provisioning" && (
            <motion.div
              key="provision"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="h-14 w-14 rounded-full border-2 border-[#242424] border-t-[#F59E0B]"
              />
              <div className="space-y-1 text-center font-mono text-xs">
                {PROVISION_LOGS.slice(0, provisionLog + 1).map((log, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(i === provisionLog ? "text-[#F59E0B]" : "text-[#E4E4E7]/40")}
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={spring.card}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="mt-4 text-sm font-mono text-emerald-400">NODE REGISTERED</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth telemetry ticker */}
        {(phase === "authorizing" || phase === "form") && (
          <div
            className={cn(
              "mt-6 border-t border-[#242424] pt-3 min-h-[2.5rem]",
              phase !== "authorizing" && "opacity-0"
            )}
          >
            <AnimatePresence mode="wait">
              {phase === "authorizing" && (
                <motion.p
                  key={authLogIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-mono text-emerald-500/70 truncate"
                >
                  {AUTH_TELEMETRY[authLogIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
