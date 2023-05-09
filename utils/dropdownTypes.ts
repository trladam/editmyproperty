export type themeType =
  | "Modern"
  | "Vintage"
  | "Minimalist"
  | "Professional"
  | "Tropical"
  | "Industrial"
  | "Neoclassic"
  | "Minimalist white coffee shop"
  | "Minimalist white salon"
  | "Minimalist white restaurant";

export const themes: themeType[] = [
  "Minimalist white coffee shop",
  "Minimalist white salon",
  "Minimalist white restaurant",
  "Modern",
  "Minimalist",
  "Professional",
  "Industrial",
  "Neoclassic",
];

export type roomType =
  | "Living Room"
  | "Dining Room"
  | "Bedroom"
  | "Bathroom"
  | "Office"
  | "Kitchen"
  | "Basement"
  | "Outdoor Patio"
  | "Gaming Room"
  | "Retail unit";

export const rooms: roomType[] = [
  // "Living Room",
  // "Dining Room",
  "Office",
  // "Bedroom",
  // "Bathroom",
  // "Basement",
  // "Kitchen",
  // "Gaming Room",
  // "Outdoor Patio",
  "Retail unit",
];

export type exteriorType = "High Street" | "Shopping Centre";
export const exterior: exteriorType[] = ["High Street", "Shopping Centre"];
