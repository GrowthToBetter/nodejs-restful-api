import userService from "../service/user.service.js";

const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res
      .status(201)
      .json({ data: user, message: "User registered successfully" });
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({ data: token, message: "Login successful" });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await userService.getUserByUsername(req.user.username);
    const isCached = !!result._fromCache;
    delete result._fromCache;
    res.setHeader("X-Cache", isCached ? "HIT" : "MISS");
    res
      .status(200)
      .json({ data: result, message: "User retrieved successfully" });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.user.username, req.body);
    res
      .status(200)
      .json({ data: result, message: "User updated successfully" });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const result = await userService.logout(req.user.username, token);
    res.status(200).json({ data: result, message: "Logout successful" });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  get,
  update,
  logout,
};
