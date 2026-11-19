import addressService from "../service/address.service.js";

const create = async (req, res, next) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const result = await addressService.create(req.user, contactId, req.body);
    res.status(201).json({
      data: result,
      message: "create success",
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const addressId = parseInt(req.params.addressId);
    const result = await addressService.get(req.user, contactId, addressId);
    res.status(200).json({
      data: result,
      message: "get success",
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const addressId = parseInt(req.params.addressId);
    const result = await addressService.update(
      req.user,
      contactId,
      addressId,
      req.body,
    );
    res.status(200).json({
      data: result,
      message: "update success",
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const addressId = parseInt(req.params.addressId);
    await addressService.remove(req.user, contactId, addressId);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const result = await addressService.list(req.user, contactId);
    res.status(200).json({
      data: result,
      message: "Get data success",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  get,
  update,
  remove,
  list,
};
