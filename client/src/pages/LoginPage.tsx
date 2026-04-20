import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginPage = () => {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b border-foreground opacity-40" />
      </div>
    );
  }

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      setIsLoading(true);
      await login(values.email, values.password, values.rememberMe);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Incorrect email or password.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const barHeights = [42, 65, 55, 80, 58, 90, 70, 85, 62, 75];
  const barDays = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W"];

  return (
    <div className="h-[100dvh] w-full bg-[#eef0f5] p-0 lg:p-5">
      <div className="h-full w-full">
        <div className="grid h-full w-full grid-cols-1 overflow-hidden border border-slate-200 bg-white shadow-xl lg:grid-cols-2 lg:rounded-[24px]">

          {/* Left — form */}
          <div className="flex items-center justify-center p-10 sm:p-14 lg:p-16">
            <div className="w-full max-w-sm">

              {/* Brand mark */}
              <div className="mb-10 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="2" width="4" height="4" rx="1" fill="white" />
                    <rect x="8" y="2" width="4" height="4" rx="1" fill="rgba(255,255,255,0.5)" />
                    <rect x="2" y="8" width="4" height="4" rx="1" fill="rgba(255,255,255,0.5)" />
                    <rect x="8" y="8" width="4" height="4" rx="1" fill="white" />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-900">Attendr</span>
              </div>

              {/* Heading */}
              <h1 className="mb-1.5 text-4xl font-semibold tracking-tight text-slate-900">Welcome back.</h1>
              <p className="mb-10 text-sm text-slate-500">Sign in to your attendance monitoring account.</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={(checked) => field.onChange(checked)}
                              className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-normal text-slate-500">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-700 [&>svg]:text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.99]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>

              <p className="mt-7 text-center text-sm text-slate-400">
                No account yet?{" "}
                <Link to="/signup" className="font-semibold text-slate-900 hover:text-indigo-600">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Right — branding panel */}
          <div className="relative hidden h-full overflow-hidden bg-[#1E1B4B] lg:flex lg:flex-col lg:justify-between p-11">

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20" />
            <div className="pointer-events-none absolute -bottom-12 -left-16 h-56 w-56 rounded-full bg-indigo-400/10" />

            {/* Top pills */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live tracking
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70">
                April 2026
              </div>
            </div>

            {/* Headline */}
            <div className="relative z-10">
              <h2 className="mb-4 text-5xl font-semibold leading-[1.1] tracking-tight text-white">
                Track attendance<br />
                with <span className="italic text-indigo-300">clarity.</span>
              </h2>
              <p className="text-sm leading-relaxed text-white/50">
                Keep daily logs, monitor intern progress, and review reports — all in one clean workspace.
              </p>
            </div>

            {/* Chart card */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Attendance overview
                </p>
                <span className="text-[11px] text-white/30">This week</span>
              </div>

              {/* Bars — fixed to grow upward */}
              <div className="grid h-16 items-end gap-1.5" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-end overflow-hidden rounded-md bg-white/[0.07]"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="w-full rounded-md"
                      style={{
                        height: `${h}%`,
                        background: h === Math.max(...barHeights)
                          ? "#818CF8"
                          : `rgba(129, 140, 248, ${0.3 + h / 200})`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Day labels */}
              <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
                {barDays.map((d, i) => (
                  <span key={i} className="text-center text-[9px] text-white/25">{d}</span>
                ))}
              </div>

              {/* Stats row */}
              <div className="mt-4 flex gap-4 border-t border-white/[0.08] pt-4">
                {[
                  { val: "94%", lbl: "Avg. attendance", badge: "↑ 3.2%" },
                  { val: "38", lbl: "Active interns", badge: "↑ 5" },
                  { val: "2", lbl: "Absent today", badge: null },
                ].map(({ val, lbl, badge }) => (
                  <div key={lbl} className="flex-1">
                    <div className="text-lg font-semibold tracking-tight text-white">{val}</div>
                    <div className="mt-0.5 text-[11px] text-white/35">{lbl}</div>
                    {badge && (
                      <div className="mt-1 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10">
                        {badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};