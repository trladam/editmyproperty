import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import {
  roomType,
  rooms,
  themeType,
  exterior,
  exteriorType,
} from "../../utils/dropdownTypes";

export type GenerateResponseData = {
  original: string | null;
  generated: string | null;
  id: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
    theme: string;
    room: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<GenerateResponseData | string>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json("Login to upload.");
  }

  // Get user from DB
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    select: {
      credits: true,
    },
  });

  // Check if user has any credits left
  console.log("user", user);
  if (user?.credits && user.credits <= -20) {
    return res.status(400).json(`You have no generations left`);
  }

  // If they have credits, decrease their credits by one and continue
  await prisma.user.update({
    where: {
      email: session.user.email!,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });

  try {
    const { imageUrl, theme, room } = req.body;
    let prompt =
      room === "Gaming Room"
        ? "a video gaming room"
        : `a ${theme.toLowerCase()} ${room.toLowerCase()}`;

    if (
      room === "Retail unit" &&
      [
        "Minimalist coffee shop",
        "Minimalist hair salon",
        "Minimalist restaurant",
        "Yoga studio",
      ].includes(theme)
    ) {
      prompt = `high resolution photography of a ${theme.toLowerCase()} interior with wooden floor, beige blue salmon pastel, sun light, contrast, realistic artstation concept art, hyperdetailed, ultradetail, cinematic 8k, architectural rendering , unreal engine 5, rtx, volumetric light, cozy atmosphere,`;
    }

    if (room === "Retail unit" && exterior.includes(theme as exteriorType)) {
      prompt = `high resolution photography of a ${theme}, modern glazing, english high street, concrete tiled pavement flooring, beige blue salmon pastel, sun light, contrast, realistic artstation concept art, hyperdetailed, ultradetail, cinematic 8k, architectural rendering , unreal engine 5, rtx, volumetric light`;
    }

    if (room === "Retail unit" && theme.toLowerCase() === "california style") {
      prompt = `Eye - Level Shot of a California contemporary style shop surrounded by clean pavement, symmetrical, exquisite contemporary luxury, trees, reflections, white, wood, lush, sunshine, sun - rays, highly detailed, photorealistic, Sony Alpha a7 III camera with a Sony FE 24 - 105mm f/ 4 G OSS lens, UHD, 8k --style raw --s 750 --q 2 --v 5.1--`;
    }
    if (room === "Retail unit" && theme.toLowerCase() === "high street") {
      prompt = `high resolution photography of a shop exterior, modern glazing, english high street, concrete tiled pavement flooring, beige blue salmon pastel, sun light, contrast, realistic artstation concept art, hyperdetailed, ultradetail, cinematic 8k, architectural rendering , unreal engine 5, rtx, volumetric light`;
    }

    console.log("----", room, theme, "---");
    console.log("propmpt", prompt);

    // return;

    let startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
        body: JSON.stringify({
          version:
            "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
          input: {
            image: imageUrl,
            structure: "hough",
            prompt: prompt,
            scale: 9,
            a_prompt: "best quality, extremly detailed",
            //"best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
            n_prompt:
              "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
          },
        }),
      }
    );

    console.log("startResponse", startResponse);

    let jsonStartResponse = await startResponse.json();

    let endpointUrl = jsonStartResponse.urls.get;
    const originalImage = jsonStartResponse.input.image;
    const roomId = jsonStartResponse.id;

    // GET request to get the status of the image restoration process & return the result when it's ready
    let generatedImage: string | null = null;
    while (!generatedImage) {
      // Loop in 1s intervals until the alt text is ready
      let finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
      });
      let jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        //generatedImage = jsonFinalResponse.output[0] as string;
        generatedImage = jsonFinalResponse.output[1] as string;
      } else if (jsonFinalResponse.status === "failed") {
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (generatedImage) {
      await prisma.room.create({
        data: {
          replicateId: roomId,
          user: {
            connect: {
              email: session.user.email!,
            },
          },
          inputImage: originalImage,
          outputImage: generatedImage,
          prompt: prompt,
        },
      });
    } else {
      throw new Error("Failed to restore image");
    }

    res.status(200).json(
      generatedImage
        ? {
            original: originalImage,
            generated: generatedImage,
            id: roomId,
          }
        : "Failed to restore image"
    );
    //** */
  } catch (error) {
    // Increment their credit if something went wrong
    await prisma.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        credits: {
          increment: 1,
        },
      },
    });
    console.error(error);
    res.status(500).json("Failed to restore image");
  }
}
