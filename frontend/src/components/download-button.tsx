import { Button } from "@/components/ui/button";
import { parsedDataAtom } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DownloadButton(props: { expanded: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const data = useAtomValue(parsedDataAtom);

  const handleClick = () => {
    setIsLoading(true);
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "parsed_data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const buttonIcon = isLoading ? (
    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
  ) : (
    <DownloadIcon className="w-4 h-4" />
  );
  const buttonText = isLoading ? "Downloading..." : "Download";

  return (
    <Button
      className="bg-neutral cursor-pointer"
      variant={"outline"}
      onClick={handleClick}
      disabled={!data || data.length === 0}
    >
      {props.expanded ? (
        <div className="flex gap-2">
          {buttonIcon}
          {buttonText}
        </div>
      ) : (
        buttonIcon
      )}
    </Button>
  );
}
