const Router = require('express');
const router = new Router();

const categoryRouter = require('./categoryRouter');
const roleRouter = require('./roleRouter');
const commentRouter = require('./commentRouter');
const textRouter = require('./textRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter);
router.use('/text', textRouter);
router.use('/comment', commentRouter);
router.use('/category', categoryRouter);
router.use('/role', roleRouter);

module.exports = router;