import express from "express";
import path from "node:path";
import userService from "../service/user.service.js";

export const docsRouter = express.Router();

docsRouter.get("/api-docs/login", (req, res) => {
  res.sendFile(path.resolve("src/docs/login.html"));
});

docsRouter.post("/api-docs/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userService.login({ username, password });

    res.cookie("docs_token", result.token, {
      path: "/api-docs",
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("api_token", result.token, {
      path: "/api-docs",
      httpOnly: false,
      sameSite: "lax",
    });

    if (req.headers["content-type"]?.includes("application/json")) {
      return res.json({ status: "success", redirect: "/api-docs" });
    }
    return res.redirect("/api-docs");
  } catch (err) {
    if (req.headers["content-type"]?.includes("application/json")) {
      return res.status(err.status || 401).json({
        errors: err.message || "Username or password wrong",
      });
    }
    return res.redirect("/api-docs/login?error=invalid");
  }
});

docsRouter.get("/api-docs/logout", (req, res) => {
  res.clearCookie("docs_token", { path: "/api-docs" });
  res.clearCookie("api_token", { path: "/api-docs" });
  res.redirect("/api-docs/login");
});
