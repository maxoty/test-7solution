import ProfileLayout from "@/components/profile-layout";

export default function Users() {
  return (
    <ProfileLayout activeTab="users">
      <h2 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Users
      </h2>
    </ProfileLayout>
  );
}
