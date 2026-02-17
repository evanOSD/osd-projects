import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Setup path directory untuk FlatCompat
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inisialisasi kompatibilitas untuk format "extends"
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1. EXTENDS (Di-load sama persis tanpa ada yang tertinggal)
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "prettier"
  ),

  // 2. SETTINGS & RULES UTAMA
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {},
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "jsx-a11y/alt-text": "off",
      "react/display-name": "off",
      "react/no-children-prop": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "lines-around-comment": [
        "warn",
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      "padding-line-between-statements": [
        "warn",
        {
          blankLine: "any",
          prev: "export",
          next: "export",
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["function", "multiline-const", "multiline-block-like"],
        },
        {
          blankLine: "always",
          prev: ["function", "multiline-const", "multiline-block-like"],
          next: "*",
        },
      ],
      "newline-before-return": "warn",
      "import/newline-after-import": [
        "error",
        {
          count: 1,
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            ["internal", "parent", "sibling", "index"],
            ["object", "unknown"],
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "~/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
          "newlines-between": "always-and-inside-groups",
        },
      ],
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            Function: "Use a specific function type instead",
            Object: "Use object instead",
            Boolean: "Use boolean instead",
            Number: "Use number instead",
            String: "Use string instead",
            Symbol: "Use symbol instead",
            any: false,
            "{}": false,
          },
        },
      ],
    },
  },

  // 3. OVERRIDES (Khusus file TypeScript dan Iconify Bundle)
  {
    // Catatan: Flat Config butuh "**/" agar mencakup file di dalam folder (mendalam)
    files: ["**/*.ts", "**/*.tsx", "src/iconify-bundle/**/*"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
