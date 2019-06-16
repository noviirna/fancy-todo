const router = require(`express`).Router();
const controller = require("../controllers/todo");

const { authentication, authorizationtodo } = require(`../middlewares/auth`);

router.use(authentication)

router.get(`/`, controller.all);
router.get(`/:id`, authorizationtodo, controller.detail);
router.get(`/project/:projectId`, authorizationtodo, controller.project);

router.post(`/`, controller.create);

router.patch(`/:id`, authorizationtodo, controller.update);

router.delete(`/:id`, authorizationtodo, controller.delete);

module.exports = router;
