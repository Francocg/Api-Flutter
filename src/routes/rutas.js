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

router.get('/post', getPost);
router.get('/buscar/:id', buscarPost);
router.post('/create' , createPost);
router.delete('/delete/:idpost',  deletePost);
router.put('/update/:id', updatepost);

module.exports = router;