const cookieManager = require("../cookieManager");

function createMockRes() {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
}

describe("cookieManager", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe("generateCookie", () => {
    it("sets a non-secure, lax cookie outside production", () => {
      process.env.NODE_ENV = "development";
      const res = createMockRes();

      cookieManager.generateCookie(res, "token-value");

      expect(res.cookie).toHaveBeenCalledWith("token", "token-value", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
    });

    it("sets a secure, strict cookie in production", () => {
      process.env.NODE_ENV = "production";
      const res = createMockRes();

      cookieManager.generateCookie(res, "token-value");

      expect(res.cookie).toHaveBeenCalledWith("token", "token-value", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });
    });
  });

  describe("clearCookie", () => {
    it("clears the cookie with options matching the current environment", () => {
      process.env.NODE_ENV = "production";
      const res = createMockRes();

      cookieManager.clearCookie(res);

      expect(res.clearCookie).toHaveBeenCalledWith("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    });
  });
});
