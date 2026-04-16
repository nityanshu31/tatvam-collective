import { headers } from "next/headers";

export async function getHeroData() {
  const host = (await headers()).get("host");

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(`${protocol}://${host}/api/hero`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hero data");
  }

  return res.json();
}
