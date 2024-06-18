import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, clearSession, isLoading: isUserLoading } = useUserContext();
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: [],
    },
  });
  const [value, setValue] = React.useState("");
  const [verified, setVerified] = React.useState(false);
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleRoleChange = (role: string) => {
    const updatedRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updatedRoles);
    form.setValue("role", updatedRoles); // Update form with the latest roles
  };

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      await clearSession(); // Clear existing sessions before attempting to sign up
      const newUser = await createUserAccount({
        ...user,
        role: selectedRoles,
      });

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const bonk = import.meta.env.VITE_APPWRITE_SIGNINTOKEN;

  return (
    <Form {...form}>
      <div className="lg:w-420 w-96 flex-center flex-col">
        <img src="/assets/images/Ecurie-Aix-Logo-blau.png" alt="logo" className="mb-10 size-18" />

        <h2 className="h3-bold md:h2-bold text-light-1 pt-5 sm:pt-12 font-Univers_LT_Std_57">
          Neues Konto erstellen
        </h2>
        <p className="text-ecurie-lightblue small-medium md:base-regular mt-2">
          Bite geben Sie Ihre Daten an, um das Partnernetzwerk nutzen zu können
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-3 w-96 md:w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-light-1">Rolle(n)</FormLabel>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-100 dark:bg-dark-4 text-left text-dark-4 dark:text-light-1 px-4 py-2 outline outline-2 rounded outline-dark-4 flex justify-between items-right w-full">
                <span>{selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Rolle auswählen'}</span>
                <span className="ml-2">⌄</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-1 text-light-1 border-4 border-dark-4 w-96">
                <DropdownMenuLabel>Rolle auswählen</DropdownMenuLabel>
                {["Ecurie-Aix", "Alumni", "Partner", "Hersteller"].map(role => (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => handleRoleChange(role)}
                    className="hover:bg-ecurie-babyblue"
                  >
                    {role}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormItem>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1">Unternehmen / Verein</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        src={"/assets/icons/password-hide-black.svg"}
                        alt="edit"
                        width={20}
                        height={20}
                      /> : <img
                        src={"/assets/icons/password-show-black.svg"}
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
          <div className="flex-center rounded-lg mt-2">
            {verified ? (
              <Button type="submit" className=" w-full flex-center shad-button_primary font-Univers_LT_Std_57">
                {isCreatingAccount || isSigningInUser || isUserLoading ? (
                  <div className="flex-center gap-2 ">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Konto erstellen"
                )}
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger className=" h-10 w-full flex-center rounded-lg">
                  <Button className="shad-button_primary font-Univers_LT_Std_57 w-full" type="button">
                    Fortfahren
                  </Button>
                </DialogTrigger>
                <DialogContent className="text-light-1 h-48 border-2">
                  <DialogHeader>
                    <DialogTitle>Bitte geben Sie ihr Einmal-Token ein. </DialogTitle>
                    <DialogDescription>
                      <div className="space-y-6 flex-center">
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          value={value}
                          onChange={(value) => setValue(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <div>
                      {value === bonk ? (
                        <DialogClose asChild>
                          <Button
                            onClick={() => { setVerified(true) }}
                            disabled={value.length != 6}
                            variant="secondary"
                            type="button"
                            className="gap-2 absolute inset-y-32 right-4 w-24 shad-button_primary font-Univers_LT_Std_57"
                          >
                            Bestätigen
                          </Button>
                        </DialogClose>
                      ) : (
                        <Button
                          onClick={() => {
                            toast({
                              title: "Falsches Token",
                              description: "Bitte überprüfen Sie ihre Eingabe oder versuchen Sie es erneut",
                            });
                          }}
                          disabled={value.length != 6}
                          variant="secondary"
                          type="button"
                          className="gap-2 absolute inset-y-32 right-6 w-24 shad-button_primary font-Univers_LT_Std_57"
                        >
                          Bestätigen
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Besitzen Sie bereits ein Konto?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Anmelden
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
