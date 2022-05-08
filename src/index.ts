import { ZObject } from "zapier-platform-core";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosTimed from "axios-timed";
import axiosRetry, {
  isNetworkOrIdempotentRequestError,
  IAxiosRetryConfig,
} from "axios-retry";
import { createZapierAdapter } from "./adapter";

export type ZapierAxiosInstanceConfig = Omit<AxiosRequestConfig, "adapter"> &
  IAxiosRetryConfig;

export { AxiosInstance };

export const createAxiosInstance = (
  z: ZObject,
  config?: ZapierAxiosInstanceConfig
): AxiosInstance => {
  if (!z) {
    throw new Error("z object is required");
  }

  const {
    retries,
    retryCondition,
    retryDelay,
    shouldResetTimeout,
    ...axiosConfig
  } = config || {};
  // Create an instance that's based on z.request
  const instance = axios.create({
    adapter: createZapierAdapter(z),
    ...axiosConfig,
  });

  axiosTimed(instance);

  // Retry logic
  axiosRetry(instance, {
    retries: typeof retries === "number" ? retries : 3,
    retryCondition:
      retryCondition ||
      ((error) => {
        return isNetworkOrIdempotentRequestError(error);
      }),
    retryDelay,
    shouldResetTimeout,
  });

  return instance;
};
