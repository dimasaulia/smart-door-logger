const router = require("express").Router();
const {
    loginRequired,
    allowedRole,
} = require("../../middlewares/userMiddlewares");
const controllers = require("./controllers");

router.route("/").post(controllers.createLog).get(controllers.list);

module.exports = router;
