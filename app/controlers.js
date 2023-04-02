const { setCookie } = require("../services/auth");
// Put your controller code here
exports.dashboard = (req, res) => {
    res.render("index");
};

exports.login = (req, res) => {
    res.render("login");
};

exports.logout = (req, res) => {
    setCookie({ res, title: "Authorization", data: "", maxAge: 1 });
    return res.redirect("/login");
};
