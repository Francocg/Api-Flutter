const {response} = require('express');
const {Pool} = require('pg');
const {database} = require('../database/connect');

const pool = new Pool(database);

const getPost = async (req, res = response) => {
    try {
        const data_post = await pool.query('select  * from posts')
        if (data_post.rows.length === 0) {
            return res.status(400).json({
                msg: 'No hay Posts!'
            })
        }
        res.status(200).json({
            Posts: data_post.rows
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const buscarPost = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.idpost, p.titulo, p.descripcion from  posts p where  p.idpost=$1', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e)
        return res.status(500).json('Internal Server error...!');
    }
}

const createPost = async(req, res) => {

    try {
        console.log(req.body);
        const { titulo, descripcion } = req.body;
        await pool.query('INSERT INTO posts(titulo, descripcion) values ($1, $2)', [titulo, descripcion]);

        return res.status(200).json(
            `Post ${titulo} registrado correctamente...!`);

    } catch (error) {
        console.log(error)
        return res.status(500).json('Algo salio mal.!')
    }
}


const deletePost = async(req, res = response) => {
    try {
        const {idpost} = req.params;
        const eliminar_post = await pool.query('delete from posts where idpost = $1 RETURNING *', [idpost])
        if(eliminar_post.rows.length===0){
            return res.status(400).json({
                msg: 'No hay posts!'
            })
        }
        res.status(200).json({
            msg: `Post  eliminado correctamente`
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const updatepost = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { titulo, descripcion } = req.body;
        await pool.query('update posts set titulo=$1, descripcion=$2 where idpost = $3', [titulo, descripcion,id]);
        return res.status(200).json(
            `Post ${id}  modificado correctamente...!`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!');
    }
}





module.exports = {
    getPost,
    buscarPost,
    createPost,
    deletePost,
    updatepost
}