const {Router} =require('express');
const {getPost, buscarPost, createPost, deletePost, updatepost} = require('../controllers/postController');
const {login, createUser} = require('../controllers/authController')
const {validarJWT} = require('../helpers/jwt')

const router = Router();

router.get('/',(req,res)=>{
    
    res.send('Bienvenido');
});

//usuarios
router.post('/login', login);
router.post('/sign',createUser)

//Post

router.get('/post',validarJWT, getPost);
router.get('/buscar/:id', validarJWT, buscarPost);
router.post('/create' ,validarJWT, createPost);
router.delete('/delete/:idpost', validarJWT, deletePost);
router.put('/update/:id', validarJWT, updatepost);

module.exports = router;