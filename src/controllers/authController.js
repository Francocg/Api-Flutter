const {reponse} = require('express');
const {Pool} = require('pg');
const {database} = require('../database/connect');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

const pool = new Pool(database);

const login = async(req, res = response) => {
    const {username, password} = req.body;
    try {
        const data_usuario = await pool.query('select usuarios.idusuario, usuarios.username, usuarios.password, usuarios.estado, roles.nombre from usuarios, usuarios_roles, roles where usuarios_roles.roles_id = roles.idrol and usuarios.username = $1', [username]);
        if(data_usuario.rows.length === 0){
            return res.status(400).json({
                msg: 'El usuario no existe!'
            })
        }
        const validarPassword = bcrypt.compareSync(password, data_usuario.rows[0].password);
        if(!validarPassword){
            return res.status(400).json({
                msg: 'El password es incorrecto!'
            })
        }
        const token = await generarJWT(data_usuario.rows[0].idusuario, data_usuario.rows[0].username,data_usuario.rows[0].nombre);
        res.status(200).json({
            msg:'Bienvenido a al app',
            token
            
        })
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal.!',
            
        })

    }    
}

const createUser = async(req, res = response) => {
    const { username, password } = req.body;
    try {
        const data_usuarios = await pool.query(`SELECT * FROM usuarios WHERE username=$1`, [username])
        
        if(data_usuarios.rows.length>0){
            return res.status(400).json({
                msg: 'El Usuario ya existe.!'
            })
        }
        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        const password_encrypt = bcrypt.hashSync(password, salt);
        await pool.query(`INSERT INTO usuarios(username, password, estado) values($1, $2, 1)`,
        [username, password_encrypt])
        return res.status(200).json({
            msg: 'Usuario creado correctamente.!'
        })
    } catch (error) {
        res.status(500).json({  
            msg: 'Algo salio mal.!'
        })
    }
}


module.exports = {
    login,
    createUser
}

