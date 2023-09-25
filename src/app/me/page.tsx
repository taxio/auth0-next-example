import { postSample } from "@/utils/APIUtils";
import { ExampleForm } from "@/components/ExampleForm";

export default async function () {
  const post = async (message: string) => {
    'use server';

    await postSample({"message": message});
  };

  return <ExampleForm onSubmit={post} />;
}