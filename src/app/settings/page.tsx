import {getMe, updateSettings} from "@/utils/APIUtils";

import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {SettingsForm} from "@/components/settings/SettingsForm";

export default withPageAuthRequired(async function Settings() {
  const me = await getMe();

  const save = async (name: string) => {
    'use server';

    await updateSettings({ name });
  };

  return <SettingsForm defaultName={me.name} onSubmit={save} />;
}, { returnTo: '/settings' });