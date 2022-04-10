import axios, { AxiosRequestConfig } from "axios";
import axiosRetry, {
  isNetworkOrIdempotentRequestError,
  IAxiosRetryConfig,
} from "axios-retry";
import { ZObject } from "zapier-platform-core";
import createZapierAdapter from "./adapter";

const createAxiosInstance = (
  z: ZObject,
  config?: Omit<AxiosRequestConfig, "adapter"> & IAxiosRetryConfig
) => {
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

export default createAxiosInstance;
