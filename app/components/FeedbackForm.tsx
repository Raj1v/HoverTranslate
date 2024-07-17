import { ThumbsUp, ThumbsDown, MessageCircleQuestion } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { recordFeedback } from "@/app/actions";

const FeedbackButtons = (props: { className?: string }) => {
  const { toast } = useToast();

  return (
    <Popover>
      <PopoverTrigger className={`flex border rounded p-2 ${props.className}`}>
        <span className="w-full p-1 text-sm">
          Feedback
          <MessageCircleQuestion className="inline ml-2" size={18} />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Button
          className="mr-2"
          variant="outline"
          size="icon"
          onClick={async () => {
            await recordFeedback(false);
            toast({
              title: "Sorry to hear that 😞",
              description: "Your feedback has been recorded 🙏",
            });
          }}
        >
          <ThumbsDown className="h-4 w-4 text-red-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={async () => {
            await recordFeedback(true);
            toast({
              title: "Yay! I'm happy you like HoverTranslate 🎉",
              description: "Please share HoverTranslate with your friends!",
            });
          }}
        >
          <ThumbsUp className="h-4 w-4 text-green-600" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default FeedbackButtons;
