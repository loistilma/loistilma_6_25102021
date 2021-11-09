const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload.middleware')

const auth = require('../middlewares/auth.middleware');
const saucesController = require('../controllers/sauce.controller')

router.get('/', auth, saucesController.get)
router.get('/:id', auth, saucesController.getById)
router.post('/', auth, upload, saucesController.create)
router.put('/:id', auth, upload, saucesController.modify)
router.delete('/:id', auth, saucesController.delete)
router.post('/:id/like', auth, saucesController.setLike)

module.exports = router