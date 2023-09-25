import { getMe } from '@/utils/APIUtils';

export default async function ProfileClient() {
  const me = await getMe().catch(e => console.error(e));

  return (
    me && (
      <div>
        <h2>{me.name}</h2>
        <p>{me.email}</p>
      </div>
    )
  );
}