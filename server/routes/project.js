const router = require(`express`).Router();
const controller = require("../controllers/project");

const { authentication, authorizationproject } = require(`../middlewares/auth`);

router.use(authentication)

router.get(`/`, controller.all);
router.get(`/:id`, controller.detail);

router.post(`/`, controller.create);

router.patch(`/:id`, authorizationproject, controller.update);

router.delete(`/:id`, authorizationproject, controller.delete);

module.exports = router;
