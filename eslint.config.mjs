import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: { 
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",

      "@typescript-eslint/ban-ts-comment": [
        "off",
        {
          "ts-ignore": true, // ✅ allow this
          "ts-expect-error": true,
          "ts-nocheck": true,
          "ts-check": false,
        },
      ]
    },
  },
];



export default eslintConfig;
