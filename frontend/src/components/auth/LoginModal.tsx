import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { REGISTER_URL, LOGIN_URL } from "@/lib/apiAuthRoutes";

interface AuthFormData {
  username?: string;
  name?: string;
  email: string;
  password: string;
  age?: number;
}

const LoginModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Login request
        const response = await fetch(LOGIN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Handle successful login
          console.log("Login successful:", data);
          
          // For manual login, we need to sign in using NextAuth to set up the session
          // We'll use the credentials provider
          const signInResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false, // We'll handle redirect manually
          });
          
          if (signInResult?.ok) {
            // Redirect to home page after successful login
            router.push("/");
            router.refresh();
          } else {
            // If NextAuth signIn fails, show error
            setError(signInResult?.error || "Login failed. Please check your credentials.");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Login failed");
        }
      } else {
        // Registration request
        if (!formData.username || !formData.age) {
          setError("Username and age are required for registration");
          return;
        }

        if (formData.age && formData.age < 18) {
          setError("Age must be above 18");
          return;
        }

        const response = await fetch(REGISTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            name: formData.name || formData.username,
            email: formData.email,
            password: formData.password,
            age: formData.age,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Handle successful registration
          console.log("Registration successful:", data);
          router.push("/");
          router.refresh();
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Registration failed");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Getting start</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLogin ? "Login to CloakRoom" : "Register to CloakRoom"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to get started with CloakRoom"}
          </DialogDescription>
        </DialogHeader>

        {/* Manual Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required={false}
                  placeholder="Enter full name (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">If left blank, your username will be used as your display name in chats</p>
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  required={!isLogin}
                  min="18"
                  placeholder="Enter age (above 18)"
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter password"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button variant="outline" onClick={handleGoogleLogin}>
          <Image
            src="/images/google.png"
            className=" mr-4"
            width={25}
            height={25}
            alt="google"
          />
          Continue with Google
        </Button>

        {/* Toggle between Login and Register */}
        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;