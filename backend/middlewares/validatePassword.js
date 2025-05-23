module.exports = (req, res, next) => {
  const { password } = req.body;

  // Minimum 6 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long and include both letters and numbers.",
    });
  }

  next();
};
