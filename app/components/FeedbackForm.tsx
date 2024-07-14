// Feedback buttons component
import { MessageCircleHeart, MessageCircleQuestion } from "lucide-react";

const FeedbackButtons = (props: { className?: string }) => {
  return (
    <div className={`mt-2 flex border rounded p-2 ${props.className}`}>
      <span className="w-full p-1 text-sm">
        Feedback
        <MessageCircleQuestion className="inline ml-2" size={18} />
      </span>
    </div>
  );
};
export default FeedbackButtons;
