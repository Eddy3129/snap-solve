//app\(dashboard)\UserWrapper.tsx

import { auth } from '@/lib/auth';
import User from './user';

export default async function UserWrapper() {
  const session = await auth();
  return <User user={session?.user} />;
}