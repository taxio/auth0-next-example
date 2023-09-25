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

type GetMeResponse = {
  email: string;
  name: string;
};

export async function getMe() {
  const { data } = await apiClient.get<GetMeResponse>("/me");
  console.log("data", data);
  return data;
}

type PostSampleRequest = {
  message: string;
}

type PostSampleResponse = {
  message: string;
}

export async function postSample(body: PostSampleRequest) {
  const { data } = await apiClient.post<PostSampleResponse>("/sample", body);
  console.log("data", data);
  return data;
}