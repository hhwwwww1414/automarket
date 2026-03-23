import type { SaleListing } from './types';

export const SELLER_LABELS: Record<string, string> = {
  owner: 'Собственник',
  flip: 'Перепродажа',
  broker: 'Подбор',
  commission: 'Комиссия',
};

export function getListingTitle(listing: SaleListing): string {
  const base = `${listing.make} ${listing.model} ${listing.year}`;
  return listing.generation ? `${base} · ${listing.generation}` : base;
}

export function getListingBadges(listing: SaleListing): string[] {
  const badges: string[] = [];
  if (listing.paintCount === 0) badges.push('без окрасов');
  if (listing.owners === 1) badges.push('1 хоз');
  if (!listing.taxi) badges.push('не такси');
  if (listing.keysCount && listing.keysCount >= 2) badges.push('2 ключа');
  if (listing.ptsOriginal) badges.push('ориг. ПТС');
  if (!listing.needsInvestment) badges.push('без вложений');
  if (listing.avtotekaStatus === 'green') badges.push('автотека зелёная');
  return badges;
}
