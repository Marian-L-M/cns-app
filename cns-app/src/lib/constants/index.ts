export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "CLOUDS AND SPACESHIPS";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Imagine Dynamic Map Storytelling";

// Updated to use Vercel URL with fallback to localhost for development
export const SERVER_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:3000`;

export const DATABASE_URL_UNPOOLED = process.env.DATABASE_CONNECTION;

export const PROJECT_URL = `https://cloudsandspaceships.com`;
export const PROJECT_NAME = `Clouds and Spaceships`;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
