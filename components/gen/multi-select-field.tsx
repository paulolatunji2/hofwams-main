import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MultiSelect } from "./multi-select";

interface CustomFormFieldProps {
  name: string;
  label: string;
  form: UseFormReturn<any>;
  createMenu?: React.ReactNode;
  placeholder?: string;
  options: string[] | { id: string; name: string }[];
}

export const MultiSelectField = ({
  name,
  label,
  form,
  createMenu,
  placeholder,
  options,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder={placeholder}
              variant="inverted"
              animation={2}
              maxCount={3}
              createMenu={createMenu}
            />
          </FormControl>
          <FormDescription>Select at least one {label}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
