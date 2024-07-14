import FeedbackButtons from "@/app/components/FeedbackForm";

const Footer = (props: { className?: string }) => {
  return (
    <footer
      className={`w-full h-20 border-t -mt-20 pt-2 pb-3 ${props.className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between text-center">
        <Credits className="absolute left-1/2 transform -translate-x-1/2" />
        <FeedbackButtons className="ml-auto" />
      </div>
    </footer>
  );
};

const Credits = (props: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center  ${props.className}`}>
      <p className="text-lg">
        Made in <span>🇨🇭</span>
      </p>
      <p>
        with ❤️ by{" "}
        <a
          className="inline underline"
          href="https://rajiv.codes"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rajiv
        </a>
      </p>
    </div>
  );
};

export default Footer;
