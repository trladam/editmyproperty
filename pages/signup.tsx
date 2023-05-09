import { useSession } from "next-auth/react";
import Script from "next/script";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import useSWR from "swr";
import ListItem from "../components/ListItem";
import Link from "next/link";

export default function Pricing() {
  const { data: session } = useSession();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR("/api/remaining", fetcher);

  return (
    <div className="flex mx-auto max-w-7xl overflow-visible flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Buy Credits</title>
      </Head>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <Script src="https://cdn.paritydeals.com/banner.js" />
      <Header
        photo={session?.user?.image || undefined}
        email={session?.user?.email || undefined}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1>Buy Credits</h1>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-black-500 ">
          You are currently testing the site as a pre-launch VIP
        </p>
        <p className="mx-auto max-w-2xl text-center text-lg leading-8 text-black-500 mb-10">
          However, if you feel that the tool will be helpful once we go live
          next month, you can secure a substantial early bird discount below.
        </p>
        {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-black-500 mb-10">
          You currently have{" "}
          <span className="font-semibold text-black-400">
            {data?.remainingGenerations}{" "}
            {data?.remainingGenerations > 1 ? "credits" : "credit"}
          </span>
          . Purchase more below.
        </p> */}
      </main>
      <div className="w-full">
        {session?.user?.email && (
          // @ts-ignore
          <stripe-pricing-table
            pricing-table-id="prctbl_1MobnNK4W9ejG97elHjeFCEq"
            publishable-key="pk_live_51HGpOvK4W9ejG97eYSm02d1hgagCOAAcKQCtH7258w6fA8wxo2PRv2xs2wSUG2xkV2YLBc0h3HxKITTFeJGtWai500o6bqGFHF"
            client-reference-id={session.user.email}
            customer-email={session.user.email}
          />
        )}
      </div>

      <div className="m-20 flex flex-col space-y-10 mt-4 mb-4 border px-8 pb-8 pt-2 border-gray-600 rounded-xl">
        <div className="flex sm:space-x-8 sm:flex-row flex-col pb-5">
          <div className="w-1/2 sm:mt-0 mt-8">
            <h3 className="mb-1 font-medium text-lg">Edit my Property Pro</h3>
            <Link
              className="m-5 flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
              href="https://buy.stripe.com/8wM3gfgFo4Q74ak000"
            >
              <p>Subscribe</p>
            </Link>
            <h1>£199 per year</h1>
            <p>
              Subscribe to unlock Edit My Property Ai Pro. Unlimited
              generations. Used by real estate professionals. EARLY BIRD
              DISCOUNT!
            </p>
            <ListItem text="Unlimited renders" />
            <ListItem text="Faster & higher quality renders" />
            <ListItem text="Keep originals & renders private" />
            <ListItem text="20+ more styles and room types" />
            <ListItem text="Premium support & request features" />
          </div>
          <div className="w-1/2 sm:mt-0 mt-8">
            <h3 className="mb-1 font-medium text-lg">
              Edit my Property for Teams
            </h3>
            <Link
              className="m-5 flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
              href="https://buy.stripe.com/8wMg3174ObevcGQ8wx"
            >
              <p>Subscribe</p>
            </Link>
            <h1>£1,499 per year</h1>
            <p>
              Subscribe to unlock Edit My Property Ai for Teams, lets you use it
              with a team of up to 10 people. Unlimited generations. Used by
              real estate professionals. EARLY BIRD DISCOUNT!
            </p>
            <ListItem text="Unlimited renders" />
            <ListItem text="Faster & higher quality renders" />
            <ListItem text="Keep originals & renders private" />
            <ListItem text="20+ more styles and room types" />
            <ListItem text="Premium support & request features" />
          </div>
        </div>
      </div>

      <p className="text-black-400 mb-5">
        Interested in team pricing or have any pricing questions? Email{" "}
        <span className="text-black-300">info@therequirementlist.com</span>
      </p>
      <Footer />
    </div>
  );
}
