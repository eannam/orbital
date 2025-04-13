import { Button } from "@/components/ui/button";
import { parseData } from "@/lib/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { toast } from "sonner";

export default function ParseButton(props: { expanded: boolean }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: parseData,
    onSuccess: () => {
      toast.success("Data parsed successfully!");
      queryClient.invalidateQueries({ queryKey: ["parsedData"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something wrong.");
    },
  });

  const handleClick = () => {
    mutate();
  };

  const buttonIcon = isPending ? (
    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
  ) : (
    <PlayIcon className="w-4 h-4" />
  );
  const buttonText = isPending ? "Parsing..." : "Parse";

  return (
    <Button
      className="cursor-pointer"
      variant={"default"}
      onClick={handleClick}
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
