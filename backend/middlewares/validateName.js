module.exports = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters long." });
  }

  next();
};
