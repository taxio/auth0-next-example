import { getAccessToken } from "@auth0/nextjs-auth0";

import {createPromiseClient, Interceptor} from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { DemoService } from "@/gen/demo/v1/demo_connect";

const authInjector: Interceptor = (next) => async (req) => {
  const { accessToken } = await getAccessToken();
  if (accessToken != undefined) {
    req.header.set("Authorization", `Bearer ${accessToken}`);
  }
  return await next(req);
};

const transport = createConnectTransport({
  baseUrl: "http://127.0.0.1:3001",
  interceptors: [authInjector],
});

export const DemoClient = createPromiseClient(DemoService, transport);
