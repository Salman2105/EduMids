const Notification = require("../Models/notification");
const User = require("../Models/user");

const notifyUser = async (userId, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for notification");
      return;
    }

    await Notification.create({
      user: userId,
      message,
    });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

module.exports = notifyUser;
