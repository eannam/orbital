import { Button } from "@/components/ui/button";
import { deleteParsedData } from "@/lib/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

export default function ResetButton(props: { expanded: boolean }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteParsedData,
    onSuccess: () => {
      toast.success("Data reset successfully!");
      queryClient.invalidateQueries({ queryKey: ["parsedData"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong.");
    },
  });

  const handleClick = () => {
    mutate();
  };

  const buttonIcon = isPending ? (
    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
  ) : (
    <RotateCcwIcon className="w-4 h-4" />
  );
  const buttonText = isPending ? "Resetting..." : "Reset";

  return (
    <Button
      variant={"outline"}
      className="bg-neutral-50 cursor-pointer"
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
