// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/auth/auth";  // Referring to the `auth.js` file
export const { GET, POST } = handlers;
