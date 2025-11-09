"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Verify from "./verify";
import { AnimatePresence, motion } from "motion/react";
import { UserCredentials } from "./login-page";
import { toast } from "sonner";


interface LoginFormProps {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: UserCredentials;
}
// Login form subcomponent
const LoginForm = ({ onInputChange, handleSubmit, formData }: LoginFormProps) => {
  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-balance">
            Login to your Acme Inc account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            placeholder="m@example.com"
            onChange={onInputChange}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="********"
            required
            onChange={onInputChange}
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </Field>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <Field className="grid grid-cols-3 gap-4 pb-6">
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Google</span>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

interface LoginFormBaseProps extends React.ComponentProps<"div"> {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: UserCredentials;
  isVerifying: boolean;
  toast:typeof toast ;
  setIsVerifying: React.Dispatch<React.SetStateAction<boolean>>;
}

// Main login card component with animation
export function LoginFormBase({onInputChange,handleSubmit,isVerifying,className,setIsVerifying,formData,toast,...props}: LoginFormBaseProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 relative">
          {/* Left side (animated content) */}
          <div className="relative h-[520px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isVerifying ? (
                <motion.div
                  key="login"
                  initial={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute w-full"
                >
                  <LoginForm
                    onInputChange={onInputChange}
                    formData={formData}
                    handleSubmit={handleSubmit}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="verify"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute w-full flex flex-col items-center gap-4 p-8"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-center">
                    Verify Code
                  </h2>
                  <Verify id={formData.id ?? ""} toast={toast} />
                  <Button variant="ghost" onClick={() => setIsVerifying(false)}>
                    ← Back to Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/login-hero.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover "
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-2">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
