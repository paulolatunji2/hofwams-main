import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface CustomFormFieldProps {
  name: string;
  label: string;
  type?: string;
  form: UseFormReturn<any>;
  placeholder?: string;
  selectItems?: string[];
  readonly?: boolean;
  compulsory?: boolean;
}

export const CustomFormField = ({
  name,
  label,
  type = "text",
  form,
  placeholder,
  selectItems,
  readonly = false,
  compulsory = false,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {type === "select" ? (
            <div className="space-y-2">
              <div className="flex gap-1">
                <FormLabel>{label}</FormLabel>
                {compulsory && <span className="text-red-500">*</span>}
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectItems?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              {type === "checkbox" ? (
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    <FormLabel>{label}</FormLabel>
                    {compulsory && <span className="text-red-500">*</span>}
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <FormLabel>{label}</FormLabel>
                    {compulsory && <span className="text-red-500">*</span>}
                  </div>
                  <FormControl>
                    {type === "textarea" ? (
                      <Textarea {...field} />
                    ) : (
                      <Input
                        readOnly={readonly}
                        type={type}
                        min={0}
                        {...field}
                      />
                    )}
                  </FormControl>
                </div>
              )}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
