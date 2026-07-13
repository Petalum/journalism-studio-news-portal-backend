const Router = require('express');
const router = new Router();
const roleController = require('../controllers/roleController');

router.get('/', roleController.getAll);
router.post('/', roleController.createRole);
router.put('/:id', roleController.changeRole);

module.exports = router;