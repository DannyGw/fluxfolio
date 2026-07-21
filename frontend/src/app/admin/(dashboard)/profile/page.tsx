import { getProfile } from "@/lib/api";
import ProfileForm from "./ProfileForm";

export default async function AdminProfilePage() {
  let profile: any = null;
  try {
    profile = await getProfile();
  } catch {
    // Profile fetch fails gracefully — null check below handles it
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
        <p>Profile not found. Make sure the database is seeded.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Edit Profile</h1>
      <ProfileForm initial={profile} />
    </div>
  );
}
