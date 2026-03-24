import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { ListingStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { createSaleListing } from '@/lib/server/marketplace';
import { buildS3PublicUrl, uploadToS3 } from '@/lib/server/s3';

export const runtime = 'nodejs';

function parseString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseOptionalString(value: unknown): string | undefined {
  const normalized = parseString(value);
  return normalized ? normalized : undefined;
}

function parseNumber(value: unknown, fallback = 0): number {
  const normalized = typeof value === 'string' ? value.trim() : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOptionalNumber(value: unknown): number | undefined {
  const normalized = parseString(value);
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeSellerType(value: string): 'owner' | 'flip' | 'broker' | 'commission' {
  return value === 'flip' || value === 'broker' || value === 'commission' ? value : 'owner';
}

function normalizeResourceStatus(value: string): 'not_listed' | 'pre_resources' | 'on_resources' {
  return value === 'pre_resources' || value === 'on_resources' ? value : 'not_listed';
}

function normalizePtsType(value: string | undefined): 'original' | 'duplicate' | 'epts' | undefined {
  if (value === 'duplicate' || value === 'epts') {
    return value;
  }

  return value === 'original' ? 'original' : undefined;
}

function normalizeInitialStatus(value: unknown): ListingStatus {
  return value === ListingStatus.DRAFT ? ListingStatus.DRAFT : ListingStatus.PENDING;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }

  return fallback;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => parseString(item))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function ensureFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

function normalizeExtension(file: File): string {
  const extension = path.extname(file.name).toLowerCase();
  if (extension) {
    return extension;
  }

  switch (file.type) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'video/mp4':
      return '.mp4';
    case 'video/quicktime':
      return '.mov';
    default:
      return '.bin';
  }
}

async function uploadIncomingFile(
  file: File,
  params: {
    listingKey: string;
    kind: 'gallery' | 'video';
    sortOrder: number;
  }
) {
  const extension = normalizeExtension(file);
  const objectKey = [
    'uploads',
    'sale',
    params.listingKey,
    params.kind,
    `${String(params.sortOrder).padStart(2, '0')}-${randomUUID()}${extension}`,
  ].join('/');

  const arrayBuffer = await file.arrayBuffer();
  await uploadToS3({
    key: objectKey,
    body: Buffer.from(arrayBuffer),
    contentType: file.type || undefined,
    cacheControl: 'public, max-age=31536000, immutable',
  });

  return {
    kind: params.kind,
    storageKey: objectKey,
    publicUrl: buildS3PublicUrl(objectKey),
    originalName: file.name,
    mimeType: file.type || undefined,
    sizeBytes: file.size,
    sortOrder: params.sortOrder,
  } as const;
}

export async function POST(request: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const payloadRaw = formData.get('payload');

    if (typeof payloadRaw !== 'string') {
      return NextResponse.json({ error: 'Missing listing payload.' }, { status: 400 });
    }

    const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
    const initialStatus = normalizeInitialStatus(payload.initialStatus);
    const sellerName = parseString(payload.sellerName);
    const contact = parseString(payload.contact);
    const make = parseString(payload.make);
    const model = parseString(payload.model);
    const city = parseString(payload.city);
    const bodyType = parseString(payload.bodyType);
    const engine = parseString(payload.engine);
    const transmission = parseString(payload.transmission);
    const drive = parseString(payload.drive);
    const description = parseString(payload.description);

    if (!sellerName || !contact || !make || !model || !city || !bodyType || !engine || !transmission || !drive || !description) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const galleryFiles = formData
      .getAll('photos')
      .map((entry) => ensureFile(entry))
      .filter((file): file is File => Boolean(file));

    if (galleryFiles.length === 0 && initialStatus !== ListingStatus.DRAFT) {
      return NextResponse.json({ error: 'At least one photo is required.' }, { status: 400 });
    }

    const listingKey = randomUUID();
    const galleryMedia = await Promise.all(
      galleryFiles.map((file, index) =>
        uploadIncomingFile(file, {
          listingKey,
          kind: 'gallery',
          sortOrder: index,
        })
      )
    );

    const videoFile = ensureFile(formData.get('video'));
    const videoMedia = videoFile
      ? [
          await uploadIncomingFile(videoFile, {
            listingKey,
            kind: 'video',
            sortOrder: 0,
          }),
        ]
      : [];

    const listing = await createSaleListing({
      createdByUserId: currentUser.id,
      initialStatus,
      sellerName,
      contact,
      make,
      model,
      generation: parseOptionalString(payload.generation),
      year: parseNumber(payload.year),
      vin: parseOptionalString(payload.vin),
      city,
      price: parseNumber(payload.price),
      priceInHand: parseOptionalNumber(payload.priceInHand),
      priceOnResources: parseOptionalNumber(payload.priceOnResources),
      bodyType,
      engine,
      power: parseNumber(payload.power),
      transmission,
      drive,
      mileage: parseNumber(payload.mileage),
      steering: parseString(payload.steering) || 'Левый',
      color: parseString(payload.color),
      trim: parseOptionalString(payload.trim),
      owners: parseNumber(payload.owners),
      registrations: parseOptionalNumber(payload.registrations),
      keysCount: parseOptionalNumber(payload.keysCount),
      ptsType: normalizePtsType(parseOptionalString(payload.ptsType)),
      paintCount: parseNumber(payload.paintCount),
      paintedElements: parseStringArray(payload.paintedElements),
      taxi: !parseBoolean(payload.notTaxi, true),
      carsharing: !parseBoolean(payload.notCarsharing, true),
      avtotekaStatus: parseBoolean(payload.avtotekaGreen) ? 'green' : undefined,
      noRestrictions: parseBoolean(payload.noRestrictions),
      techOk: parseBoolean(payload.techOk, true),
      glassOriginal: parseBoolean(payload.glassOriginal),
      noInvestment: parseBoolean(payload.noInvestment, true),
      investmentNote: parseOptionalString(payload.investmentNote),
      trade: parseBoolean(payload.trade),
      kickback: parseBoolean(payload.kickback),
      sellerType: normalizeSellerType(parseString(payload.sellerType)),
      resourceStatus: normalizeResourceStatus(parseString(payload.resourceStatus)),
      description,
      videoUrlExternal: videoFile ? undefined : parseOptionalString(payload.videoUrl),
      media: [...galleryMedia, ...videoMedia],
    });

    return NextResponse.json({ id: listing.id, status: listing.status }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create listing.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
