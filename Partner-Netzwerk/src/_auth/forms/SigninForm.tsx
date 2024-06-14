import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "Login failed. Please try again." });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      toast({ title: "Login failed. Please try again.", });

      return;
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Ecurie-Aix-Logo-blau.png" alt="logo" className="mb-10 size-18" />
        <h2 className="h3-bold text-light-1 md:h2-bold pt-5 sm:pt-12 font-Univers_LT_Std_57">
          Willkommen zurück!
        </h2>
        <p className="text-ecurie-lightblue small-medium md:base-regular mt-2">
          Bitte melden Sie sich mit einem vorhandenen Konto an
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1">E-Mail</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1">Passwort</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} className="shad-input pr-10" {...field} />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <img
                        src={"/assets/icons/password-hide.svg"}
                        alt="edit"
                        width={20}
                        height={20}
                      /> : <img
                        src={"/assets/icons/password-show.svg"}
                        alt="edit"
                        width={20}
                        height={20}
                      />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dialog>
            <DialogTrigger className="text-left pl-2 text-ecurie-babyblue">Passwort vergessen?</DialogTrigger>
            <DialogContent className="border-2 text-light-1 ">
              <DialogHeader>
                <DialogTitle>Kontaktieren Sie bitte einen Admin</DialogTitle>
                <DialogDescription>
                  <div className="flex gap-2 pt-1">
                    <img
                      src={"/assets/icons/mail-icon-white.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="pt-2">@moritz.langenhan@rwth-aachen.de, @linus.holtkamp@rwth-aachen.de</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <img
                      src={"/assets/icons/slack-new-logo.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="pt-2">@MLAN, @LHOL</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button type="submit" className="shad-button_primary font-Univers_LT_Std_57">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Anmelden"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Noch kein Konto?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Konto erstellen
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;