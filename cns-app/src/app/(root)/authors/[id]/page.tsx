import UserProfileDisplay from "@/components/displays/UserProfileDisplayModule";

interface Params {
  params: { id: string };
}

export default async function authorProfilePage({ params }: Params) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  return (
    <div className="w-full flex flex-col gap-4">
      <UserProfileDisplay id={parseInt(id)} />
    </div>
  );
}
