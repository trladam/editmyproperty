import Link from "next/link";
import { Sidetab } from "@typeform/embed-react";
import { createRef } from "react";

export default function Footer() {
  const sidetabRef = createRef();
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3 border-gray-500">
      {/* <Sidetab
        id="some"
        opacity={100}
        iframeProps="title=ai tool"
        buttonColor="#0445AF"
        buttonText="Try me!"
        medium="snippet"
      /> */}
      <div className="text-black-500">
        Built by the team behind{" "}
        <a
          href="https://therequirementlist.com"
          target="_blank"
          className="font-bold hover:underline transition hover:text-black-300 underline-offset-2"
        >
          The Requirement List{" "}
        </a>
      </div>
      <div className="flex flex-col space-x-4 pb-4 sm:pb-0 justify-between items-center">
        <div>
          The Requirement List is trusted by the leading property consultancies
          in the UK:
        </div>
        <img src="/logos.png" alt="" style={{ maxWidth: 200 }} />
      </div>
    </footer>
  );
}
