import { LeafIcon } from "@/components/gen/icons";

const Loading = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-pulse text-[40px] flex gap-2 items-center">
        <LeafIcon className="size-10" />
        Hofwams
      </div>
    </main>
  );
};

export default Loading;
