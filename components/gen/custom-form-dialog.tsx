import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CustomFormDialog({
  title,
  children,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mr-auto sm:mx-auto text-emerald-500">
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
