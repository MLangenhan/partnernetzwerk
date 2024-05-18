import * as React from "react"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Dropdown Menu Checkbox
  type Checked = DropdownMenuCheckboxItemProps["checked"]

  const [showEcurie_Aix, setshowEcurie_Aix] = React.useState<Checked>(false)
  const [showEcurie_Alumni, setShowEcurie_Alumni] = React.useState<Checked>(false)
  const [showSponsor, setShowSponsor] = React.useState<Checked>(false)
  const [showManufacturer, setShowManufacturer] = React.useState<Checked>(false)

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });

        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });

        navigate("/sign-in");

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
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Ecurie-Aix-Logo-blau.png" alt="logo" className="mb-10 size-18" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 font-Univers_LT_Std_57">
          Create a new account
        </h2>
        <p className="text-ecurie-lightblue small-medium md:base-regular mt-2">
          To use the network, Please enter your details
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

          <DropdownMenu>
            <p className="text-sm">Role</p>
            <DropdownMenuTrigger className="bg-dark-4 text-right pr-4 pb-3 pt-2 outline outline-2 rounded outline-dark-4">⌄</DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-1 border-4 border-dark-4 w-96">
              <DropdownMenuLabel>Choose Roles</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showEcurie_Aix}
                onCheckedChange={setshowEcurie_Aix}
                className = "hover:bg-ecurie-babyblue"
              >
                Ecurie-Aix
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showEcurie_Alumni}
                onCheckedChange={setShowEcurie_Alumni}
                className = "hover:bg-ecurie-darkblue"
              >
                Ecurie-Alumni
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showSponsor}
                onCheckedChange={setShowSponsor}
                className = "hover:bg-ecurie-lightred"
              >
                Sponsor
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showManufacturer}
                onCheckedChange={setShowManufacturer}
                className = "hover:bg-ecurie-darkred"
              >
                Manufacturer
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Organization</FormLabel>
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
                <FormLabel className="shad-form_label">Email</FormLabel>
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
                <FormLabel className="shad-form_label">Password</FormLabel>
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
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;