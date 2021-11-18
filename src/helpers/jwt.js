const jwt = require('jsonwebtoken');

const generarJWT = (idusuario, username, nombre) =>{

    return new Promise((resolve, reject) =>{

        const payload = {
            idusuario, 
            username,
            nombre
        }
        
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '72h'
        }, (error, token) =>{
            if(error){
                reject('Error al generar el token');
            }else{
                resolve(token);
            }
        });
    })
}

const validarJWT = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader;

    //const token = req.header('token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token'
        })
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    }catch(error){
        return res.status(401).json({
            msg: 'Token no valido'
        })
    } 
}

module.exports = {
    generarJWT,
    validarJWT
}