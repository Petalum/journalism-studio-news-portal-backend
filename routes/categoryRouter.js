const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.createOne);
router.put('/:id', categoryController.changeOne);
router.get('/', categoryController.getAll);

module.exports = router;