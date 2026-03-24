import { WantedPageClient } from '@/components/wanted/wanted-page-client';
import { getPublishedWantedListings } from '@/lib/server/marketplace';

export const dynamic = 'force-dynamic';

export default async function WantedPage() {
  const listings = await getPublishedWantedListings();
  return <WantedPageClient initialListings={listings} />;
}
