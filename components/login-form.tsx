"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/firebase-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  displayName: z.string().min(2, "Mínimo 2 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
}).refine((obj) => obj.confirmPassword === obj.password, {
  message: "Senhas devem ser iguais",
  path: ["confirmPassword"],
});

type LoginSchema = z.infer<typeof loginSchema>;
type SignupSchema = z.infer<typeof signupSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
      email: "",
      displayName: "",
    },
  });

  const handleLogin = async (data: LoginSchema) => {
    setLoading(true);
    setError("");
    try {
      await signIn(data.email, data.password);
      router.push("/campaign/select");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupSchema) => {
    setLoading(true);
    setError("");
    try {
      await signUp(data.email, data.password, data.displayName);
      router.push("/campaign/select");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Tabs defaultValue="login">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Bem-vindo!</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Entre ou crie uma conta
            </p>
          </div>

          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              <Controller
                name="email"
                control={loginForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={loginForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              <Controller
                name="displayName"
                control={signupForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="signup-display-name">Nome</FieldLabel>
                    <Input
                      id="signup-display-name"
                      type="text"
                      placeholder="Seu nome"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={signupForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={signupForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="signup-password">Senha</FieldLabel>
                    <Input
                      id="signup-password"
                      type="password"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={signupForm.control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="signup-password-confirm">
                      Confirmar Senha
                    </FieldLabel>
                    <Input
                      id="signup-password-confirm"
                      type="password"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                    {error && (
                      <FieldError>{error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </TabsContent>
        </FieldGroup>
      </Tabs>
    </div>
  );
}
