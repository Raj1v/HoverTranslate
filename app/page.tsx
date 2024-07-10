"use client";
import Main from "@/app/main";

export default function Home() {
  return (
    <>
      <Main />
      <footer className="flex flex-col items-center justify-center w-full h-20 border-t text-center -mt-16">
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
      </footer>
    </>
  );
}
