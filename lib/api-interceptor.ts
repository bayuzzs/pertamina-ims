import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

export const withBearerToken = (
  config: InternalAxiosRequestConfig,
  accessToken?: string,
) => {
  if (!accessToken) {
    return config;
  }

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

export const createApiClient = (
  accessToken?: string,
  options?: AxiosRequestConfig,
): AxiosInstance => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const client = axios.create({
    baseURL: apiBaseUrl,
    ...options,
  });

  client.interceptors.request.use((config) =>
    withBearerToken(config, accessToken),
  );

  return client;
};
