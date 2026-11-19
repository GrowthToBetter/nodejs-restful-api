import contactService from "../service/contact.service.js";

const create = async (req, res, next) => {
  try {
    const contact = await contactService.create(req.user, req.body);
    res
      .status(201)
      .json({ data: contact, message: "Contact created successfully" });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const contact = await contactService.get(req.user, parseInt(req.params.id));
    const isCached = !!contact._fromCache;
    delete contact._fromCache;
    res.setHeader("X-Cache", isCached ? "HIT" : "MISS");
    res.status(200).json({ data: contact });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await contactService.update(
      req.user,
      parseInt(req.params.id),
      req.body,
    );
    res
      .status(200)
      .json({ data: contact, message: "Contact updated successfully" });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await contactService.remove(
      req.user,
      parseInt(req.params.id),
    );
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const user = req.user;
    const request = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      page: Number(req.query.page) || 1,
      size: Number(req.query.size) || 10,
    };
    const result = await contactService.search(user, request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
      _links: result._links,
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
  search,
};
