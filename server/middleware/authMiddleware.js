const jwt = require("jsonwebtoken");
const User = require("../Models/user");

// Middleware to verify user token
const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    // Fetch the user from the database to ensure the role is included
    const user = await User.findById(verified.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = { id: user._id, role: user.role }; // Attach user ID and role to the request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Middleware to check user role
const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access Forbidden" });
    
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Forbidden" });

    console.log("User Role:", req.user.role);
  }


  next();
};



module.exports = { verifyToken, checkRole };

// module.exports = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access Denied: Admins only" });
//   }
//   next();
// };
