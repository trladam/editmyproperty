import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import { CompareSlider } from "../components/CompareSlider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import Toggle from "../components/Toggle";
import appendNewToName from "../utils/appendNewToName";
import downloadPhoto from "../utils/downloadPhoto";
import DropDown from "../components/DropDown";
import {
  roomType,
  rooms,
  themeType,
  themes,
  exterior,
} from "../utils/dropdownTypes";
import { GenerateResponseData } from "./api/generate";
import { useSession, signIn } from "next-auth/react";
import useSWR from "swr";
import { Rings } from "react-loader-spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";

// Configuration for the uploader
const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Modern");
  const [room, setRoom] = useState<roomType>(rooms[0]);
  const [type, setType] = useState<string>("interior");

  const [roomListType, setRoomListType] = useState<string[]>([]);
  const [themesListType, setThemesListType] = useState<string[]>([]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR("/api/remaining", fetcher);
  const { data: session, status } = useSession();

  const options = {
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
    editor: { images: { crop: false } },
    //tags: [data?.remainingGenerations > 3 ? "paid" : "free"],
    styles: {
      colors: {
        primary: "#2563EB", // Primary buttons & links
        error: "#d23f4d", // Error messages
        shade100: "#000", // Standard text
        shade200: "#000", // Secondary button text
        shade300: "#000", // Secondary button text (hover)
        shade400: "#000", // Welcome text
        shade500: "#000", // Modal close button
        shade600: "#ccc", // Border
        shade700: "#eee", // Progress indicator background
        shade800: "#eee", // File item background
        shade900: "#ffff", // Various (draggable crop buttons, etc.)
      },
    },
    onValidate: async (file: File): Promise<undefined | string> => {
      return undefined;
      return data.remainingGenerations === 0
        ? `No more credits left. Buy more above.`
        : undefined;
    },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl, theme, room }),
    });

    let response = (await res.json()) as GenerateResponseData;
    if (res.status !== 200) {
      setError(response as any);
    } else {
      mutate();
      const rooms =
        (JSON.parse(localStorage.getItem("rooms") || "[]") as string[]) || [];
      rooms.push(response.id);
      localStorage.setItem("rooms", JSON.stringify(rooms));
      setRestoredImage(response.generated);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }

  const router = useRouter();

  // const dropDownData = {
  //   interior: [
  //     {
  //       value: "Office",
  //       data: [
  //         "Modern",
  //         "Minimalist",
  //         "Professional",
  //         "Industrial",
  //         "Neoclassic",
  //       ],
  //     },
  //     {
  //       value: "Retail unit",
  //       data: [
  //         "Minimalist white coffee shop",
  //         "Minimalist white salon",
  //         "Minimalist white restaurant",
  //         "Modern",
  //         "Minimalist",
  //         "Professional",
  //         "Industrial",
  //         "Neoclassic",
  //       ],
  //     },
  //   ],
  //   exterior: [
  //     {
  //       value: "Retail unit",
  //       data: [
  //         "Minimalist white coffee shop",
  //         "Minimalist white salon",
  //         "Minimalist white restaurant",
  //         "Modern",
  //         "Minimalist",
  //         "Professional",
  //         "Industrial",
  //         "Neoclassic",
  //       ],
  //     },
  //   ],
  // };

  const setTypeTheme = () => {
    if (type.toLowerCase() === "interior") {
      setRoomListType([
        "Retail unit",
        "Office",
        "Living Room",
        "Dining Room",
        "Bedroom",
        "Bathroom",
        "Kitchen",
        "Garden",
        "Gaming Room",
      ]);
    }
    if (type.toLowerCase() === "exterior") {
      setRoomListType(["Retail unit"]);
    }
  };

  const setRoomType = () => {
    if (!room) return;
    if (type.toLowerCase() === "interior" && room.toLowerCase() !== "retail unit") {
      setThemesListType([
        "Modern",
        "Minimalist",
        "Professional",
        "Industrial",
        "Neoclassic",
      ]);
    }
    if (
      type.toLowerCase() === "interior" &&
      room.toLowerCase() === "retail unit"
    ) {
      setThemesListType([
        "Minimalist coffee shop",
        "Minimalist hair salon",
        "Minimalist restaurant",
        "Yoga studio",
        "Modern",
        "Minimalist",
        "Professional",
        "Industrial",
        "Neoclassic",
      ]);
    }
    if (
      type.toLowerCase() === "exterior" &&
      room.toLowerCase() === "retail unit"
    ) {
      setThemesListType(["High street", "Shopping centre", "California Style"]);
    }
    // if (type.toLowerCase() === "interior" && room.toLowerCase() === "rooms") {
    //   setThemesListType([
    //     "Living Room",
    //     "Dining Room",
    //     "Bedroom",
    //     "Bathroom",
    //     "Kitchen",
    //     "Office",
    //     "Garden",
    //     "Gaming Room",
    //   ]);
    // }
  };

  useEffect(() => {
    setTypeTheme();
  }, [type]);

  useEffect(() => {
    setRoomType();
  }, [room, roomListType]);

  useEffect(() => {
    setTypeTheme();
  }, []);

  console.log("theme-->", theme);
  console.log("room", room);
  console.log("type", type);

  const Type = ({ type }: { type: string }) => {
    const interiorBGColor = type === "interior" ? "bg-active" : "bg-inactive";
    const exteriorBGColor = type === "exterior" ? "bg-active" : "bg-inactive";

    return (
      <div
        className="inline-flex mb-5 rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        role="group"
      >
        <button
          type="button"
          className={`inline-block rounded-l ${interiorBGColor} px-6 pb-2 pt-2.5 text-base font-medium uppercase leading-normal text-black transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700`}
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => setType("interior")}
        >
          INTERIOR
        </button>
        <button
          type="button"
          className={`inline-block rounded-r ${exteriorBGColor} px-6 pb-2 pt-2.5 text-base font-medium uppercase leading-normal text-black transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700`}
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => setType("exterior")}
        >
          EXTERIOR
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (router.query.success === "true") {
      toast.success("Payment successful!");
    }
  }, [router.query.success]);

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Edit my Property</title>
      </Head>
      <Header
        photo={session?.user?.image || undefined}
        email={session?.user?.email || undefined}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        {/* {status === "authenticated" ? (
          <Link
            href="/signup"
            className="border border-black-700 rounded-2xl py-2 px-4 text-black-400 text-sm my-6 duration-300 ease-in-out hover:text-black-300 hover:scale-105 transition"
          >
            Pricing is now available.{" "}
            <span className="font-semibold text-black-200">Click here</span> to
            generate more rooms!
          </Link>
        ) : (
          // <a
          //   href="https://twitter.com/nutlope/status/1635674124738523139?cxt=HHwWhsCz1ei8irMtAAAA"
          //   target="_blank"
          //   rel="noopener noreferrer"
          //   className="border border-black-700 rounded-2xl py-2 px-4 text-black-400 text-sm my-6 duration-300 ease-in-out hover:text-black-300 transition"
          // >
          //   Over{" "}
          //   <span className="font-semibold text-black-200">
          //     1 million users
          //   </span>{" "}
          //   have used roomGPT so far
          // </a>
          <></>
        )} */}

        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Generate your room
        </h1>
        <Type type={type} />
        {status === "authenticated" && data && !restoredImage && (
          <p className="text-black-400">
            You have{" "}
            <span className="font-semibold text-black-300">
              {data.remainingGenerations}{" "}
              {data?.remainingGenerations > 1 ? "credits" : "credit"}
            </span>{" "}
            left.{" "}
            <span className="text-red-600">
              Don't worry you're a pre-launch VIP and have unlimited credits
            </span>
          </p>
        )}

        {status === "unauthenticated" && (
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="flex justify-between items-center w-full flex-col mt-4">
                <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                  <div className="max-w-xl text-black-300">
                    Sign in below to create a free account and redesign your
                    room today.
                  </div>
                  <button
                    onClick={() => signIn("google")}
                    className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                  >
                    <Image
                      src="/google.png"
                      width={20}
                      height={20}
                      alt="google's logo"
                    />
                    <span>Sign in with Google</span>
                  </button>
                  <button
                    onClick={() => signIn("linkedin")}
                    className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                  >
                    <Image
                      src="/linkedin.png"
                      width={20}
                      height={20}
                      alt="google's logo"
                    />
                    <span>Sign in with LinkedIn</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
        )}

        {/* {data && data.remainingGenerations > -20 && ( */}
        {data && data.remainingGenerations > -20 && (
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="flex justify-between items-center w-full flex-col mt-4">
                {restoredImage && (
                  <div>
                    Here's your remodeled <b>{room.toLowerCase()}</b> in the{" "}
                    <b>{theme.toLowerCase()}</b> theme!{" "}
                  </div>
                )}
                <div
                  className={`${
                    restoredLoaded ? "visible mt-6 -ml-8" : "invisible"
                  }`}
                >
                  <Toggle
                    className={`${
                      restoredLoaded ? "visible mb-6" : "invisible"
                    }`}
                    sideBySide={sideBySide}
                    setSideBySide={(newVal) => setSideBySide(newVal)}
                  />
                </div>
                {restoredLoaded && sideBySide && (
                  <CompareSlider
                    original={originalPhoto!}
                    restored={restoredImage!}
                  />
                )}
                {status === "loading" ? (
                  <div className="max-w-[670px] h-[250px] flex justify-center items-center">
                    <Rings
                      height="100"
                      width="100"
                      color="white"
                      radius="6"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="rings-loading"
                    />
                  </div>
                ) : status === "authenticated" && !originalPhoto ? (
                  <>
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="flex mt-3 items-center space-x-3">
                        <Image
                          src="/number-1-white.svg"
                          width={30}
                          height={30}
                          alt="1 icon"
                        />
                        <p className="text-left font-medium">
                          Choose your existing{" "}
                          {type === "interior" ? `room` : `property`} type.
                        </p>
                      </div>
                      <DropDown
                        theme={room}
                        // @ts-ignore
                        setTheme={(newRoom) => setRoom(newRoom)}
                        themes={roomListType}
                      />
                    </div>
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="flex mt-10 items-center space-x-3">
                        <Image
                          src="/number-2-white.svg"
                          width={30}
                          height={30}
                          alt="2 icon"
                        />
                        <p className="text-left font-medium">
                          Choose your desired theme.
                        </p>
                      </div>
                      <DropDown
                        theme={theme}
                        // @ts-ignore
                        setTheme={(newTheme) => setTheme(newTheme)}
                        themes={themesListType}
                      />
                    </div>

                    <div className="mt-4 w-full max-w-sm">
                      <div className="flex mt-6 w-96 items-center space-x-3">
                        <Image
                          src="/number-3-white.svg"
                          width={30}
                          height={30}
                          alt="1 icon"
                        />
                        <p className="text-left font-medium">
                          Upload a picture of your room.
                        </p>
                      </div>
                    </div>
                    <UploadDropZone />
                  </>
                ) : (
                  !originalPhoto && (
                    <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                      <div className="max-w-xl text-black-300">
                        Sign in below to create a free account and redesign your
                        room today.
                      </div>
                      <button
                        onClick={() => signIn("google")}
                        className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                      >
                        <Image
                          src="/google.png"
                          width={20}
                          height={20}
                          alt="google's logo"
                        />
                        <span>Sign in with Google</span>
                      </button>
                      <button
                        onClick={() => signIn("linkedin")}
                        className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                      >
                        <Image
                          src="/linkedin.png"
                          width={20}
                          height={20}
                          alt="google's logo"
                        />
                        <span>Sign in with LinkedIn</span>
                      </button>
                    </div>
                  )
                )}

                {originalPhoto && !restoredImage && (
                  <Image
                    alt="original photo"
                    src={originalPhoto}
                    className="rounded-2xl h-96"
                    width={475}
                    height={475}
                  />
                )}
                {restoredImage && originalPhoto && !sideBySide && (
                  <div className="flex sm:space-x-4 sm:flex-row flex-col">
                    <div>
                      <h2 className="mb-1 font-medium text-lg">
                        Original Room
                      </h2>
                      <Image
                        alt="original photo"
                        src={originalPhoto}
                        className="rounded-2xl relative w-full h-96"
                        width={475}
                        height={475}
                      />
                    </div>
                    <div className="sm:mt-0 mt-8">
                      <h2 className="mb-1 font-medium text-lg">
                        Generated Room
                      </h2>
                      <a href={restoredImage} target="_blank" rel="noreferrer">
                        <Image
                          alt="restored photo"
                          src={restoredImage}
                          className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                          width={475}
                          height={475}
                          onLoadingComplete={() => setRestoredLoaded(true)}
                        />
                      </a>
                    </div>
                  </div>
                )}
                {loading && (
                  <button
                    disabled
                    className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                  >
                    <span className="pt-4">
                      <LoadingDots color="white" style="large" />
                    </span>
                  </button>
                )}
                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
                    role="alert"
                  >
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                      Please try again later.
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                      {error}
                    </div>
                  </div>
                )}
                <div className="flex space-x-2 justify-center">
                  {originalPhoto && !loading && !error && (
                    <button
                      onClick={() => {
                        setOriginalPhoto(null);
                        setRestoredImage(null);
                        setRestoredLoaded(false);
                        setError(null);
                      }}
                      className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                    >
                      Generate New image
                    </button>
                  )}
                  {restoredLoaded && !loading && !error && (
                    <button
                      onClick={() => {
                        console.log("g");
                        originalPhoto && generatePhoto(originalPhoto);
                      }}
                      className="bg-[#F89735] rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                    >
                      Generate this theme again
                    </button>
                  )}
                  {restoredLoaded && (
                    <button
                      onClick={() => {
                        downloadPhoto(
                          restoredImage!,
                          appendNewToName(photoName!)
                        );
                      }}
                      className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                    >
                      Download image
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
        )}

        {data && data.remainingGenerations < -20 && (
          <>
            <span>Too many generations.</span>
          </>
        )}

        <Toaster position="top-center" reverseOrder={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
