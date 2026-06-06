import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/modules/identity";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";

export function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signUp.email({
      email,
      password,
      name: name.trim() || email.split("@")[0] || "User",
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? m.sign_up_error_fallback());
      return;
    }

    await navigate({ to: "/", reloadDocument: true });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
          <CardHeader>
            <CardTitle className="display-title text-2xl">{m.sign_up_title()}</CardTitle>
            <CardDescription>{m.sign_up_description()}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="sign-up-name">{m.sign_up_name_label()}</Label>
                <Input
                  id="sign-up-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={m.sign_up_name_placeholder()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-up-email">{m.sign_up_email_label()}</Label>
                <Input
                  id="sign-up-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-up-password">{m.sign_up_password_label()}</Label>
                <Input
                  id="sign-up-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? m.sign_up_submitting() : m.sign_up_title()}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
              {m.sign_up_has_account()}{" "}
              <Link
                to="/sign-in"
                className="font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
              >
                {m.auth_sign_in()}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
