const router = require("express").Router();
const controller = require("./controlers");
const {
    loginRequired,
    logoutRequired,
} = require("../middlewares/UiMiddleware");
const { allowedRole } = require("../middlewares/userMiddlewares");
router.get(
    "/",
    loginRequired,
    allowedRole("SUPER ADMIN"),
    controller.dashboard
);
router.get("/login", logoutRequired, controller.login);
router.get("/logout", loginRequired, controller.logout);

module.exports = router;
