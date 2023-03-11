const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesControllers = require('../controllers/sauces');

router.get('/', auth, saucesControllers.getAllSauce);
router.post('/', auth, multer, saucesControllers.createSauce);
router.get('/:id', auth, saucesControllers.getOneSauce);
router.put('/:id', auth, multer, saucesControllers.modifySauce);
router.delete('/:id', auth, saucesControllers.deleteSauce);
router.post('/:id/like', auth, saucesControllers.likeOrDislike);

module.exports = router;