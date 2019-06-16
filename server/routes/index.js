const router = require(`express`).Router();

const user = require(`./user`);
const todo = require(`./todo`);
const project = require("./project");

router.use("/users", user)
router.use("/todos", todo)
router.use("/projects", project)

module.exports = router;
