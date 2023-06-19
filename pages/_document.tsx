import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    let description = "Generate your dream room in seconds.";
    let ogimage = "https://www.roomgpt.io/og-image.png";
    let sitename = "www.editmyproperty.co.uk";
    let title = "Room Generator";

    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/fav.png" type="image/gif"></link>
          <meta name="description" content={description} />
          <meta property="og:site_name" content={sitename} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta property="og:image" content={ogimage} />
          <meta name="twitter:image" content={ogimage} />
        </Head>
        <body className="text-black">
          <Main />
          <NextScript />
          <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
          <noscript>
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src="https://queue.simpleanalyticscdn.com/noscript.gif"
              alt=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
