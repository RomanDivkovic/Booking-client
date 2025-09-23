import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier
    },
    rules: {
      // Disable the base rule
      "no-unused-vars": "off",
      // Enable the TS rule
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // React rules
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],

      // General rules
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Prettier integration
      "prettier/prettier": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["api/**/*.{ts,js}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      "@typescript-eslint": typescript
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error"
    }
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".next/**",
      "coverage/**",
      "*.config.js",
      "*.config.ts",
      "src/pages/__tests__/**"
    ]
  },
  {
    files: ["src/pages/__tests__/**/*.{ts,tsx}"],
    ...jest.configs["flat/recommended"],
    globals: {
      ...globals.jest
    }
  }
];
