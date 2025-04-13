import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { reportIssue } from "@/lib/mutations";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
  registrationDateAndPlanReference: string;
  description: string;
  leaseDateAndTerm: string;
  lesseeTitle: string;
  notes: string[];
};

function ParsedItemCard(props: Props) {
  const { mutate } = useMutation({
    mutationFn: reportIssue,
    onSuccess: () => {
      toast.success("Issue reported. We're on it. 🫡");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong.");
    },
  });

  const handleReportIssue = () => {
    mutate({ id: props.id });
  };

  return (
    <Card className="border-neutral-300 border w-[600px]">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div className="font-semibold text-lg">{props.lesseeTitle}</div>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"outline"}
                  className="bg-neutral-50 cursor-pointer"
                  onClick={handleReportIssue}
                >
                  <AlertTriangleIcon className="w-2 h-2 text-orange-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Report Issue</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-2">
          <div className="text-sm text-neutral-500">
            Registration Date &amp; Plan Reference
          </div>
          <div className="text-sm">
            {props.registrationDateAndPlanReference}
          </div>
          <div className="text-sm text-neutral-500">Description</div>
          <div className="text-sm">
            {props.description.split(",").map((desc, index) => (
              <div key={index}>{desc.trim()}</div>
            ))}
          </div>
          <div className="text-sm text-neutral-500">
            Date of Lease &amp; Term
          </div>
          <div className="text-sm">{props.leaseDateAndTerm}</div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col">
          <span className="text-sm text-neutral-500">Notes</span>
          <ul className="list-disc pl-4">
            {props.notes.map((note, index) => (
              <li key={index} className="text-sm">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
}

export default memo(ParsedItemCard);
