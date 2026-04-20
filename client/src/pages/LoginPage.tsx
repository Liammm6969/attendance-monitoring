import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm border border-border/50 shadow-none rounded-xl p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-lg font-medium">Welcome back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm text-muted-foreground font-normal">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-9 bg-muted/40 border-border/50 text-sm"
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
                  <FormLabel className="text-sm text-muted-foreground font-normal">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-9 bg-muted/40 border-border/50 text-sm"
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
                        className="h-3.5 w-3.5"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-muted-foreground font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-9 text-sm font-medium mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="my-6 border-t border-border/40" />

        <CardFooter className="p-0 justify-center">
          <p className="text-sm text-muted-foreground">
            No account?{" "}
            <Link
              to="/signup"
              className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};