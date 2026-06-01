/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { signupUser, signinUser } from "@/api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setUser } from "@/lib/session";

export default function AuthPage() {
  return <AuthPageInner />;
}

function AuthPageInner() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password || (mode === "signup" && !name)) {
    return;
  }
  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (mode === "signup" && !passwordRegex.test(password)) {
  alert(
    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
  );

  return;
}

  try {
    setLoading(true);

if (mode === "signup") {
  await signupUser({
    name,
    email,
    password,
  });

  alert("Account created successfully. Please sign in.");

  setMode("login");

  setPassword("");
    } else {
      const result = await signinUser({
        email,
        password,
      });

      setUser({
        user_id: result.user.user_id,
        name: result.user.name,
        email: result.user.email,
        token: result.access_token,
      });

      navigate("/");
    }
} catch (error: any) {
  console.error("Authentication Error:", error);

  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    "Something went wrong";

  alert(message);
} finally {
  setLoading(false);
}
};

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2">
        {/* Left: brand pitch */}
        <div className="hidden flex-col gap-8 lg:flex">
          <Link to="/auth" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold">PriceAI</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Orchestrator</p>
            </div>
          </Link>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-gradient">AI-powered Dynamic Pricing</span>
              <br />for E-commerce
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Orchestrated multi-agent reinforcement learning that adapts prices in real time across regions, segments, demand and inventory.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              { icon: Zap, title: "Real-time orchestration", desc: "Sub-second pricing decisions across 1000s of SKUs." },
              { icon: Globe2, title: "Region-aware policy", desc: "Localized pricing for every market and segment." },
              { icon: ShieldCheck, title: "Enterprise-grade", desc: "Auditable decisions and policy guardrails." },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-lg border border-border/60 bg-gradient-card p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-card-elevated text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: auth card */}
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold">PriceAI</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">AI-powered Dynamic Pricing</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated sm:p-8">
            <div className="mb-6 inline-flex rounded-lg border border-border bg-card-elevated p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${
                    mode === m ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-semibold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to continue to your pricing workspace."
                : "Start orchestrating AI-driven prices in minutes."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <Field icon={User} label="Full name" type="text" value={name} onChange={setName} placeholder="Alex Kumar" />
              )}
              <Field icon={Mail} label="Work email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
              <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

              <Button
                type="submit"
                disabled={loading}
                className="group h-11 w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "login" ? "New to PriceAI?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-primary hover:underline"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type, value, onChange, placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-border bg-card-elevated pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </label>
  );
}
