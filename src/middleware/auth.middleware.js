
// importar jsonwebtoken para generar tokens de autenticacion
import jwt from "jsonwebtoken"
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, accessTokenSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    return next();
  };
};

export { authenticateJWT, authorizeRoles };
