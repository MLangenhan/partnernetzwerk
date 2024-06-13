"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "relative peer inline-flex h-8 w-16 shrink-0 cursor-pointer border-dark-4 dark:border-light-1 items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-transparent ring-dark-4 dark:ring-light-1 shadow-lg ring-2 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      )}
    />

    {/* Sun and Moon icons */}
    <img
      src={"/assets/icons/sun.svg"}
      alt="sun icon"
      width={20}
      height={20}
      className={cn(
        "absolute left-1 transition-opacity data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100"
      )}
    />
    <img
      src={"/assets/icons/moon.svg"}
      alt="moon icon"
      width={20}
      height={20}
      className={cn(
        "absolute right-1 transition-opacity data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
