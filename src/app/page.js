import Hero from "@/components/home/Hero";
import { getHeroData } from "@/services/hero.service";

export default async function HomePage() {
  const heroData = await getHeroData();

  return (
    <Hero
      imageUrl={heroData.imageUrl}
      title={heroData.title}
      subtitle={heroData.subtitle}
    />
  );
}