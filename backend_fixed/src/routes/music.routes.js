const express = require('express');
const musicControllers = require('../controllers/music.controller');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middlewares')

const upload = multer({
    storage: multer.memoryStorage()
})


const router = express.Router();


router.post('/upload', authMiddleware.authArtist,  upload.single('music'),  musicControllers.createMusic)

router.post('/album', authMiddleware.authArtist, musicControllers.createAlbum)

router.get('/', authMiddleware.authUser, musicControllers.getAllMusics)
router.get('/albums', authMiddleware.authUser, musicControllers.getAllAlbums)
router.get('/albums/:albumId', authMiddleware.authUser, musicControllers.getAlbumById)


module.exports = router;