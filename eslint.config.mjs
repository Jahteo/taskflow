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
    ignores: [
      // Ignore generated Prisma files
      "app/generated/**/*",
      // Ignore build output
      ".next/**/*",
      "dist/**/*",
      // Ignore dependencies
      "node_modules/**/*",
    ],
  },
  {
    files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
    rules: {
      // Allow any types in test files for mocking
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused variables in tests (common with mock functions)
      "@typescript-eslint/no-unused-vars": "off",
      // Allow require statements in test setup
      "@typescript-eslint/no-require-imports": "off",
      // Allow img elements in tests
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      // Warn instead of error for unused variables in application code
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      // Allow empty object types with a warning
      "@typescript-eslint/no-empty-object-type": "warn",
      // Warn for explicit any instead of error
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
