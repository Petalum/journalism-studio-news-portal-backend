const Router = require('express');
const router = new Router();
const textController = require('../controllers/textController');

router.post('/', textController.createText);
router.put('/:id', textController.changeText);
router.put('/:id/send', textController.sendText);
router.put('/:id/return', textController.returnText);
router.put('/:id/publish', textController.publishText);
router.get('/', textController.getAll);
router.get('/:id', textController.getOne);
router.delete('/:id', textController.deleteOne);

module.exports = router;