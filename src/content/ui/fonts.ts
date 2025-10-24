import { Playfair_Display as PlayfairDisplay, Raleway } from "next/font/google";

export const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "700"],
});

export const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway-sans",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "600", "700"],
});
