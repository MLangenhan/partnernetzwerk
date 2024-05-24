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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);

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

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Ecurie-Aix-Logo-blau.png" alt="logo" className="mb-10 size-18" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 font-Univers_LT_Std_57">
          Neues Konto erstellen
        </h2>
        <p className="text-ecurie-lightblue small-medium md:base-regular mt-2">
          Bite geben Sie Ihre Daten an, um das Partnernetzwerk nutzen zu können
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-3 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="shad-form_label">Rolle(n)</FormLabel>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-dark-4 text-left px-4 py-2 outline outline-2 rounded outline-dark-4 flex justify-between items-center w-full">
                <span>{selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Rolle auswählen'}</span>
                <span className="ml-2">⌄</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-1 border-4 border-dark-4 w-full">
                <DropdownMenuLabel>Choose Roles</DropdownMenuLabel>
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
                <FormLabel className="shad-form_label">Unternehmen</FormLabel>
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
                <FormLabel className="shad-form_label">E-Mail</FormLabel>
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
                <FormLabel className="shad-form_label">Passwort</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary font-Univers_LT_Std_57">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Konto erstellen"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Besitzen Sie bereits ein Konto?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Anmelden
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
