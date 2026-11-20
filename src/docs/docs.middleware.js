import { prismaClient } from "../web/database.js";

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  const cookies = {};
  const items = cookieHeader.split(";");
  for (const item of items) {
    const parts = item.trim().split("=");
    if (parts.length >= 2) {
      cookies[parts[0]] = decodeURIComponent(parts.slice(1).join("="));
    }
  }
  return cookies;
};

export const docsAuthMiddleware = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.docs_token;

  if (!token) {
    return res.redirect("/api-docs/login");
  }

  const user = await prismaClient.user.findFirst({
    where: { token },
    select: { username: true },
  });

  if (!user) {
    res.clearCookie("docs_token", { path: "/api-docs" });
    return res.redirect("/api-docs/login");
  }

  req.docsUser = user;
  next();
};
