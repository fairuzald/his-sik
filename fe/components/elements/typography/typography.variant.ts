import { cva } from "class-variance-authority";

export const typographyVariants = cva("", {
  variants: {
    level: {
      xs: "text-[10px] lg:text-xs",
      sm: "text-xs lg:text-sm",
      base: "text-sm lg:text-base",
      lg: "text-sm md:text-base xl:text-lg",
      xl: "text-base lg:text-lg 2xl:text-xl",
      "2xl": "text-lg lg:text-xl xl:text-2xl",
      "3xl": "text-2xl font-semibold lg:text-[32px]",
      "4xl": "text-2xl sm:text-3xl md:text-4xl",
      "5xl": "text-3xl sm:text-4xl md:text-5xl",
      "6xl": "text-4xl lg:text-5xl 2xl:text-6xl",
      "7xl": "text-4xl  sm:text-5xl md:text-7xl",
      "8xl": "text-5xl lg:text-6xl 2xl:text-8xl",
      "9xl": "text-6xl lg:text-7xl 2xl:text-9xl",
      super: "text-9xl md:text-[200px] lg:text-[250px] 2xl:text-[300px]",
      tr: "text-[12px] lg:text-sm",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-500",
      muted: "text-muted-foreground",
      accent: "text-accent-500",
      white: "text-white",
      black: "text-black",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case",
    },
  },
  defaultVariants: {
    level: "base",
    weight: "normal",
    align: "left",
    color: "default",
    transform: "normal",
  },
});
