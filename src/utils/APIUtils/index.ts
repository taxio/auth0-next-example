import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:3001/",
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

type GetMeResponse = {
  email: string;
  name: string;
  picture: string;
};

export async function getMe() {
  const { data } = await apiClient.post<GetMeResponse>("demo.v1.DemoService/GetMe", {});
  console.log("data", data);
  return data;
}

type UpdateSettingsRequest = {
  name: string;
  picture: string;
}

type UpdateSettingsResponse = {
  name: string;
  picture: string;
}

export async function updateSettings(body: UpdateSettingsRequest) {
  const { data } = await apiClient.post<UpdateSettingsResponse>("demo.v1.DemoService/UpdateSettings", body);
  console.log("data", data);
  return data;
}