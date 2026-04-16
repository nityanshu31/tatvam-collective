export async function getHeroData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hero data");
  }

  return res.json();
}