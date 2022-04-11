import nock from "nock";
import zapier, { Bundle, ZObject } from "zapier-platform-core";
import { createAxiosInstance } from "../src";

describe("zapier-axios", () => {
  it("should run", async () => {
    const appTester = zapier.createAppTester({});
    const perform = async (z: ZObject, bundle: Bundle) => {
      const spy = jest.spyOn(z, "request");

      const axios = createAxiosInstance(z, {
        baseURL: "https://api.example.com",
      });

      nock.disableNetConnect();
      nock("https://api.example.com")
        .get("/user")
        .query({ active: true })
        .reply(200, { id: 1, name: "Ikbel" }, { foo: "bar" });

      const response = await axios.get("/user", {
        params: {
          active: true,
        },
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        url: "https://api.example.com/user",
        method: "get",
        params: {
          active: true,
        },
        body: undefined,
        headers: {
          Accept: "application/json, text/plain, */*",
        },
        skipThrowForStatus: true,
        _addContext: expect.any(Function),
      });

      expect(response.status).toEqual(200);
      expect(response.headers).toEqual({
        "content-type": "application/json",
        foo: "bar",
      });
      expect(response.data).toEqual({
        id: 1,
        name: "Ikbel",
      });
    };
    await appTester(perform, {});
  });
});
