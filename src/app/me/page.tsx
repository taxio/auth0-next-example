import { DemoClient } from "@/utils/APIUtils";

import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {UserProfile} from "@/components/me/UserProfile";

export default withPageAuthRequired(async function Me() {
  const me = await DemoClient.getMe({});
  return <UserProfile email={me.email} name={me.name} picture={me.picture} />
}, { returnTo: '/me' });