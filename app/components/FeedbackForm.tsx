// Feedback buttons component
import { MessageCircleHeart, MessageCircleQuestion } from "lucide-react";

const FeedbackButtons = (props: {}) => {
  return (
    <div className="mt-2 flex justify-center space-x-1 border rounded p-2">
      <span className="w-full p-1 text-sm">
        Feedback
        <MessageCircleQuestion className="inline ml-2" size={18} />
      </span>
    </div>
  );
};
export default FeedbackButtons;
