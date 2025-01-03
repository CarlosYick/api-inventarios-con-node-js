const createError = require('http-errors');
const debug = require("debug")("app:module-users-controller");

const { UsersService } = require("./services");
const { Response } = require('../common/response');

module.exports.UsersController = {
    getUsers: async (req,res) => {
        try {
            let users = await UsersService.getAll();
            return Response.success(res, 200, 'Lista de usuarios', users);
        } catch (error){
            debug (error);
            return Response.error(res);
        }
    },
    getUser: async (req, res) => {
        try {
            const { params: { id } } = req;
            if (!UsersService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let user = await UsersService.getById(id);
            if (!user) {
                return Response.error(res, new createError.NotFound());
            }
            return Response.success(res, 200, `Usuario ${id}`, user);
        } catch (error) {
            debug(error);
            return Response.error(res, new createError.InternalServerError(error.message));
        }
    },

    createUser: async (req,res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0){
                Response.error(res, new createError.BadRequest());
            }
            else{
                const insertedId = await UsersService.create(body);
                Response.success(res, 201, 'Usuario agregado', insertedId);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    updateUser: async (req, res) => {
        try{
            const { params: { id } } = req;
            if (!UsersService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let user = await UsersService.getById(id);
            if (!user) {
                return Response.error(res, new createError.NotFound());
            }
            const { body } =req;
            if (!body || Object.keys(body).length === 0){
                return Response.error(res, new createError.BadRequest());
            }
            else{
                const userUpdated = await UsersService.update(id, body);
                return Response.success(res, 200, 'Usuario actualizado', userUpdated);
            }
        } catch (error){
            debug(error);
            return Response.error(res);
        }
    },
    deleteUser: async (req, res) => {
        try{
            const { params: { id } } = req;
            if (!UsersService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let user = await UsersService.getById(id);
            if (!user) {
                return Response.error(res, new createError.NotFound());
            }
            const userDeleted = await UsersService.deleteById(id);
            return Response.success(res, 200, 'Usuario eliminado', userDeleted);

        } catch (error){
            debug(error);
            return Response.error(res);
        }
    },
};