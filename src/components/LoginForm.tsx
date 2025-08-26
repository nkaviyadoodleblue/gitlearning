import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import medicalHero from "@/assets/medical-hero.jpg";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { checkIsLoggedIn, login } from "@/store/authSlice";
import { useForm } from "react-hook-form";
import Input from "./common/Input";
import { useAppSelector } from "@/hooks/use-selector";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const LoginForm = () => {

  const { handleSubmit, register, formState: { errors } } = useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state?.auth.isLoginLoading);
  const user = useAppSelector(state => state?.auth.user);
  const navigate = useNavigate();

  // const navigate = useNavigate()

  const onSubmit = async (data) => {
    const res = await dispatch(login(data))
    if (res)
      navigate("/")
  }

  useEffect(() => {
    dispatch(checkIsLoggedIn()).then((res) => {
      if (res)
        navigate("/")
    })
  }, [])


  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={medicalHero}
          alt="ACE Physician Service"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">ACE Physician Service</h1>
            <p className="text-xl opacity-90 max-w-md">
              Professional medical billing and patient balance management system
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center lg:hidden">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">ACE Physician Service</h1>
            <p className="text-muted-foreground">Medical billing management</p>
          </div>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Access your medical billing dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  register={register}
                  rules={{
                    required: "Username is required"
                  }}
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  errors={errors}
                />
                <Input
                  register={register}
                  name="password"
                  rules={{
                    required: "Password is required"
                  }}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  errors={errors}
                />
                <Button
                  type="submit"
                  variant="medical"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
};