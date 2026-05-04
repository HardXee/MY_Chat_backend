import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
   // console.log(token)

    if (!token) {
      return res.status(401).json({
        message: "Access denied"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.user = decoded;

   
    next();

  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Invalid token"
    });
  }
};

export default auth;