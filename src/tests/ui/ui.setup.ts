import { test } from "fixtures";
import path from "path";
import { SALES_PORTAL_URL } from "config/env";

const authFile = path.resolve(process.cwd(), "src", ".auth", "user.json");

test("Login as Admin via API", async ({ page, loginApiService }) => {
  const token = await loginApiService.loginAsAdmin();
  const url = new URL(SALES_PORTAL_URL);
  await page.context().addCookies([
    {
      name: "Authorization",
      value: token,
      domain: url.hostname,
      path: "/",
      expires: -1,
      httpOnly: false,
      secure: url.protocol === "https:",
      sameSite: "Lax",
    },
  ]);
  await page.context().storageState({ path: authFile });
});
