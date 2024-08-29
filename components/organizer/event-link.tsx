"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EventLink = ({ link }: { link: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy the link.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event!",
          url: link,
        });
        toast.success("Link shared successfully!");
      } catch (error) {
        toast.error("Failed to share the link.");
      }
    } else {
      // Fallback to copy if sharing is not supported
      handleCopy();
    }
  };

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900 rounded-md p-4 shadow-2xl">
      <Label className="text-xl font-semibold dark:text-emerald-100 mb-4 inline-block">Event Link</Label>
      <div className="flex gap-4">
        <Input value={link} readOnly className="mr-2" />
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className={copied ? "text-green-500" : ""} />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleShare}>
          <Share2 />
        </Button>
      </div>
    </div>
  );
};
