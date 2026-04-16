import { headers } from "next/headers";

export async function getHeroData() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) throw new Error("Host header missing");

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/hero`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hero data");
  }

  return res.json();
}
