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

export default {
    register,
}
