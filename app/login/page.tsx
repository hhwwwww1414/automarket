import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { getSessionUser, resolveNextPath } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sessionUser = await getSessionUser();
  const params = searchParams ? await searchParams : undefined;
  const nextValue = Array.isArray(params?.next) ? params?.next[0] : params?.next;
  const nextPath = resolveNextPath(nextValue, '/account');

  if (sessionUser) {
    redirect(nextPath);
  }

  return <AuthForm mode="login" />;
}
