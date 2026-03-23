'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SaleListing } from '@/lib/types';
import { formatPrice, formatMileage } from '@/lib/marketplace-data';
import { getListingTitle, SELLER_LABELS } from '@/lib/listing-utils';
import { cn } from '@/lib/utils';

const TABLE_COLUMNS = [
  { key: 'photo', label: '', width: '72px' },
  { key: 'auto', label: 'Авто', width: '160px' },
  { key: 'price', label: 'Цена', width: '100px' },
  { key: 'inHand', label: 'В руки', width: '95px' },
  { key: 'city', label: 'Город', width: '110px' },
  { key: 'mileage', label: 'Пробег', width: '88px' },
  { key: 'engine', label: 'Дв. / КПП', width: '130px', mdOnly: true },
  { key: 'owners', label: 'Влад.', width: '56px' },
  { key: 'paint', label: 'Окрасы', width: '80px' },
  { key: 'status', label: 'Статус', width: '110px' },
  { key: 'resources', label: 'Ресурсы', width: '80px' },
] as const;

interface ListingsTableProps {
  listings: SaleListing[];
  priorityIndices?: Set<number>;
  className?: string;
}

/** Реальная таблица: sticky header, строки с hover, компактные колонки. */
export function ListingsTable({ listings, priorityIndices = new Set(), className }: ListingsTableProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border overflow-hidden bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm',
        className
      )}
    >
      <div className="overflow-x-auto max-h-[calc(100vh-16rem)] overflow-y-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm table-fixed" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {TABLE_COLUMNS.map((col) => (
              <col key={col.key} style={{ width: col.width, minWidth: col.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'sticky top-0 z-10 px-3 py-2 text-left text-xs font-medium text-muted-foreground',
                    'whitespace-nowrap overflow-hidden text-ellipsis',
                    'bg-muted/95 dark:bg-surface-3 backdrop-blur-sm',
                    'mdOnly' in col && col.mdOnly ? 'hidden md:table-cell' : ''
                  )}
                  style={{ width: col.width, minWidth: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.map((listing, index) => (
              <ListingTableRow
                key={listing.id}
                listing={listing}
                priority={priorityIndices.has(index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ListingTableRowProps {
  listing: SaleListing;
  priority?: boolean;
}

const CELL_CLASS = 'px-3 py-1.5 align-middle whitespace-nowrap overflow-hidden text-ellipsis';
const CELL_LINK = 'block w-full min-w-0 hover:text-teal-accent transition-colors';

function ListingTableRow({ listing, priority = false }: ListingTableRowProps) {
  const title = getListingTitle(listing);
  const sellerLabel = SELLER_LABELS[listing.sellerType] ?? listing.sellerType;
  const onResources = listing.resourceStatus === 'on_resources';
  const engineTrans = `${listing.engine} / ${listing.transmission}`;

  return (
    <tr className="border-b border-border/50 hover:bg-muted/50 dark:hover:bg-white/[0.03] transition-colors">
      <td className={`${CELL_CLASS} w-[72px]`}>
        <Link href={`/listing/${listing.id}`} className="block">
          <div className="w-14 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={listing.images[0] ?? ''}
              alt={title}
              width={56}
              height={40}
              className="w-full h-full object-cover"
              sizes="56px"
              priority={priority}
            />
          </div>
        </Link>
      </td>
      <td className={CELL_CLASS}>
        <Link href={`/listing/${listing.id}`} className={`${CELL_LINK} font-medium text-foreground truncate`}>
          {title}
        </Link>
      </td>
      <td className={`${CELL_CLASS} tabular-nums text-foreground font-medium`}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {formatPrice(listing.price)}
        </Link>
      </td>
      <td className={`${CELL_CLASS} tabular-nums text-muted-foreground text-xs`}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {listing.priceInHand ? formatPrice(listing.priceInHand) : '—'}
        </Link>
      </td>
      <td className={`${CELL_CLASS} text-muted-foreground text-xs`}>
        <Link href={`/listing/${listing.id}`} className={`${CELL_LINK} truncate`}>
          {listing.city}
        </Link>
      </td>
      <td className={`${CELL_CLASS} tabular-nums text-muted-foreground text-xs`}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {formatMileage(listing.mileage)}
        </Link>
      </td>
      <td className={`${CELL_CLASS} text-muted-foreground text-xs hidden md:table-cell`}>
        <Link href={`/listing/${listing.id}`} className={`${CELL_LINK} truncate`}>
          {engineTrans}
        </Link>
      </td>
      <td className={`${CELL_CLASS} text-muted-foreground text-xs tabular-nums`}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {listing.owners}
        </Link>
      </td>
      <td className={`${CELL_CLASS} text-muted-foreground text-xs`}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {listing.paintCount === 0 ? 'без окр' : `${listing.paintCount} окр`}
        </Link>
      </td>
      <td className={`${CELL_CLASS} text-muted-foreground text-xs`}>
        <Link href={`/listing/${listing.id}`} className={`${CELL_LINK} truncate`}>
          {sellerLabel}
        </Link>
      </td>
      <td className={CELL_CLASS}>
        <Link href={`/listing/${listing.id}`} className={CELL_LINK}>
          {onResources ? (
            <span className="text-teal-accent font-medium text-xs">Да</span>
          ) : (
            <span className="text-muted-foreground/60 text-xs">—</span>
          )}
        </Link>
      </td>
    </tr>
  );
}
