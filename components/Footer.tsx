import Link from "next/link";
import { Sidetab } from "@typeform/embed-react";
import Script from "next/script";
import { createRef } from "react";
// @ts-ignore
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export default function Footer() {
  const sidetabRef = createRef();
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3 border-gray-500">
      {/* <Sidetab
        id="some"
        iframeProps="title=ai tool"
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

      <TawkMessengerReact
        propertyId="649051de94cf5d49dc5e99cd"
        widgetId="1h39rvjn7"
      />

      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <noscript>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
    </footer>
  );
}
