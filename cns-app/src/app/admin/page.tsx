import { auth } from "@/../auth";

export default async function adminPage() {
  const session = await auth();
  if (!session) {
    return <h1>Access restricted</h1>;
  }

  return <h1>Ello Boss!</h1>;
}
