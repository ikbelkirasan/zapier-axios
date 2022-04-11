import { AxiosPromise, AxiosRequestConfig } from "axios";
import buildFullPath from "axios/lib/core/buildFullPath";
import settle from "axios/lib/core/settle";
import { HttpMethod, HttpRequestOptions, ZObject } from "zapier-platform-core";

type ZapierHTTPOptions = HttpRequestOptions & {
  url: string;
  raw?: true;
};

const parseHeaders = (headers: any) => {
  return [...(headers as any).entries()].reduce(
    (result: any, current: [any, any]) => {
      const [name, value] = current;
      result[name] = value;
      return result;
    },
    {}
  );
};

export const createZapierAdapter =
  (z: ZObject) =>
  (config: AxiosRequestConfig): AxiosPromise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const url = buildFullPath(config.baseURL, config.url);
        const headers = {
          ...config.headers,
        };

        if (config.auth) {
          headers.Authorization =
            "Basic " +
            Buffer.from(`${config.auth.username}:${config.auth.password}`);
        }

        const options: ZapierHTTPOptions = {
          url,
          method: config.method as HttpMethod,
          body: config.data,
          params: config.params,
          headers: headers as any,
          skipThrowForStatus: true,
        };

        const rawResponse = await z.request(options);
        const response = {
          data: rawResponse.content,
          status: rawResponse.status,
          headers: parseHeaders(rawResponse.headers),
          config: config,
        };

        settle(resolve, reject, response);
      } catch (error) {
        reject(error);
      }
    });
  };
