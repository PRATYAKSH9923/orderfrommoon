import { getRestaurantSettings } from "@/lib/queries";
import { publicEnv } from "@/lib/env";
import { Landing } from "@/components/Landing";

export default async function Home() {
  const settings = await getRestaurantSettings().catch(() => null);
  const name = settings?.name ?? publicEnv.restaurantName;
  const tagline = settings?.tagline ?? "Just Waffle It";

  return <Landing name={name} tagline={tagline} />;
}
