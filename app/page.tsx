import { HomePageClient } from '@/components/marketplace/home-page-client';
import { getPublishedSaleListings } from '@/lib/server/marketplace';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const listings = await getPublishedSaleListings();
  return <HomePageClient initialListings={listings} />;
}
