// const jwt = require("jsonwebtoken");

// exports.verifyToken = async (req, res, next) => {
//   try {
//     const bearerToken = req.headers.authorization;
//     console.log("Received Token:", bearerToken);

//     // Check if the Bearer token is provided and properly formatted
//     if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Bearer token not found or malformed",
//       });
//     }

//     // Extract the token from the Bearer header
//     const token = bearerToken.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Token not found" });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log("JWT verification error:", err);
//         return res.status(401).json({
//           success: false,
//           message: "Invalid or expired token",
//         });
//       }

//       // Store the decoded user info in the request for use in other routes
//       req.user_id = decoded.userId;
//       req.email = decoded.email;
//       next();
//     });
//   } catch (error) {
//     console.log("Token verification error:", error);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("authHeader", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid!" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from header
    const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

    jwt.verify(token, secretKey, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token verification failed!", error: err.message });
      }

      req.userId = decode.userId; // Set `req.user` to the decoded token payload
      req.email = decode.email; // Set `req.user` to the decoded token payload
      console.log("Decoded User:", decode); // Debugging output
      next();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
