import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

apiClient.interceptors.request.use(async request => {
  const { accessToken } = await getAccessToken();
  const headers = request.headers ?? {};

  if (accessToken != undefined) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  request.headers = headers;

  return request;
});

type MeResponse = {
  email: string;
  name: string;
};

export async function fetchMe() {
  try {
    const {data} = await apiClient.get<MeResponse>("/me");
    return data;
  } catch (e) {
    console.error(e);
    throw e as Error;
  }
}

export default async function ProfileClient() {
  const me = await fetchMe().catch(e => console.error(e));

  return (
    me && (
      <div>
        <h2>{me.name}</h2>
        <p>{me.email}</p>
      </div>
    )
  );
}