import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  title: string;
  children: React.ReactNode;
  description?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger?: boolean;
}

export function CustomDialog({
  title,
  children,
  description,
  isOpen,
  setIsOpen,
  trigger = true,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
