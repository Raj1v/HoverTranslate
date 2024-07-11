"use client";
import Main from "@/app/main";
import FeedbackButtons from "./components/FeedbackForm";

export default function Home() {
  return (
    <>
      <Main className="max-w-6xl mx-auto pt-20" />
      <footer className="w-full h-20 border-t -mt-20 pt-2 pb-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-center">
          <div className="flex flex-col items-center justify-center flex-grow">
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
          <div className="flex justify-end">
            <FeedbackButtons />
          </div>
        </div>
      </footer>
    </>
  );
}
