import { createTheme } from "@mantine/core";
import { designTokens } from "./designTokens";

export const theme = createTheme({
  primaryColor: "teal",
  fontFamily: designTokens.fonts.body,
  headings: {
    fontFamily: designTokens.fonts.body,
  },
});
