const Router = require('express');
const router = new Router();
const textController = require('../controllers/textController');

router.post('/', textController.createText);
router.put('/:id', textController.changeText);
router.put('/:id/publish', textController.publish);
router.get('/', textController.getAll);
router.get('/:id', textController.getOne);
router.delete('/:id', textController.deleteOne);

module.exports = router;