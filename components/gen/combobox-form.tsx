"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  options: string[];
  name: string;
  label: string;
  form: UseFormReturn<any>;
  createOption?: React.ReactNode;
}

export function ComboboxForm({
  options,
  name,
  label,
  form,
  createOption,
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options?.find((option) => option === field.value)
                    : "Select option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder={`"Search ${name}...`} />
                {createOption}
                <CommandList>
                  <CommandEmpty>
                    <p>No {name} found.</p>
                    <p className="text-xs text-muted-foreground">
                      Tip: Create a new {name}
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {options?.map((option) => (
                      <CommandItem
                        value={option}
                        key={option}
                        onSelect={() => {
                          form.setValue(name, option);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
