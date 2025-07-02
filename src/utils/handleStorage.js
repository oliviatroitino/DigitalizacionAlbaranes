const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req, file, callback){ // pasan argumentos automaticamente
        const pathStorage = __dirname+"/../storage"
        callback(null, pathStorage) // error y destination
    },
    filename:function(req, file, callback){ // sobreescribimos o renombramos
        // tienen extension jpg, pdf, mp4
        const ext = file.originalname.split(".").pop() // el ultimo valor
        const filename = "file-"+Date.now()+"."+ext
        callback(null, filename)
    }
})

const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 2048 * 2048 * 5 
    }
})

const memory = multer.memoryStorage()
const uploadMiddlewareMemory = multer({storage: memory})

module.exports = { uploadMiddleware, uploadMiddlewareMemory };

