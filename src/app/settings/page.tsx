import { DemoClient } from "@/utils/APIUtils";

import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {SettingsForm} from "@/components/settings/SettingsForm";

export default withPageAuthRequired(async function Settings() {
  const me = await DemoClient.getMe({});

  const save = async (name: string) => {
    'use server';

    await DemoClient.updateSettings({ name, picture: 'https://example.com/images/tmp.png' });
  };

  return <SettingsForm defaultName={me.name} onSubmit={save} />;
}, { returnTo: '/settings' });