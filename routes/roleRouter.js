const Router = require('express');
const router = new Router();
const roleController = require('../controllers/roleController');

router.get('/', roleController.getAll);
router.post('/', roleController.createOne);
router.put('/:id', roleController.changeOne);

module.exports = router;