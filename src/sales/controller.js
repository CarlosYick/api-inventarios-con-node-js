const createError = require('http-errors');
const debug = require("debug")("app:module-sales-controller");

const { ProductsService } = require("../products/services");
const { UsersService } = require("../users/services");
const { SalesService } = require ("./services");
const { Response } = require('../common/response');

module.exports.SalesController = {
    getSales: async (req,res) => {
        try {
            let sales = await SalesService.getAll();
            return Response.success(res, 200, 'Lista de ventas', sales);
        } catch (error){
            debug (error);
            return Response.error(res);
        }
    },
    getSale: async (req,res) => {
        try {
            const { params: { id } } = req;
            if (!SalesService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let sale = await SalesService.getById(id);
            if(!sale){
                return Response.error(res, new createError.NotFound());
            }
            else{
                return Response.success(res, 200, `Venta ${id}`, sale);
            }
        }catch (error) {
            debug(error);
            return Response.error(res);
        }
    },
    createSale: async (req,res) => {
        try {
            const { body } = req; 
            const { idClient, idProduct, cantidad } = body;

            if (!UsersService.validate(idClient)) {
                return Response.error(res, new createError.BadRequest("ID del cliente no válido"));
            }
            if (!ProductsService.validate(idProduct)) {
                return Response.error(res, new createError.BadRequest("ID del producto no válido"));
            }

            let product = await ProductsService.getById(idProduct);
            if(!product){
                return Response.error(res, new createError.NotFound());
            }
            let user = await UsersService.getById(idClient);
            if(!user){
                return Response.error(res, new createError.NotFound());
            }

            if (!body || Object.keys(body).length === 0){
                return Response.error(res, new createError.BadRequest());
            }

            const quantityAvailable = await ProductsService.getProductQuantity(idProduct); 
            if (quantityAvailable - cantidad < 0) { 
                return Response.error(res, new createError.Conflict("Cantidad solicitada supera la cantidad disponible")); 
            }

            await ProductsService.updateProductQuantity(idProduct, cantidad);
            const insertedId = await SalesService.create(body)
            return Response.success(res, 201, 'Venta hecha', insertedId);

        } catch (error) {
            debug(error);
            return Response.error(res);
        }
    },

    deleteSale: async (req, res) => {
        try{
            const { params: { id } } = req;
            if (!SalesService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let sale = await SalesService.getById(id);
            if (!sale) {
                return Response.error(res, new createError.NotFound());
            }
            const saleDeleted = await SalesService.deleteById(id);
            return Response.success(res, 200, 'Venta eliminado', saleDeleted);

        } catch (error){
            debug(error);
            return Response.error(res);
        }
    },
};