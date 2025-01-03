const createError = require('http-errors');
const debug = require("debug")("app:module-products-controller");

const { ProductsService } = require("./services");
const { Response } = require('../common/response');

module.exports.ProductsController = {
    getProducts: async (req,res) => {
        try {
            let products = await ProductsService.getAll();
            return Response.success(res, 200, 'Lista de productos', products);
        } catch (error){
            debug (error);
            return Response.error(res);
        }
    },
    getProduct: async (req,res) => {
        try {
            const { params : { id } } = req;
            if (!ProductsService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let product = await ProductsService.getById(id);
            if(!product){
                return Response.error(res, new createError.NotFound());
            }
            else{
                return Response.success(res, 200, `Producto ${id}`, product);
            }
        }catch (error) {
            debug(error);
            return Response.error(res);
        }
    },
    createProduct: async (req,res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0){
                return Response.error(res, new createError.BadRequest());
            }
            else{
                const insertedId = await ProductsService.create(body);
                debug(body);
                return Response.success(res, 201, 'Producto agregado', insertedId);
            }
        } catch (error) {
            debug(error);
            return Response.error(res);
        }
    },

    updateProduct: async (req, res) => {
        try{
            const { params: { id } } = req;
            if (!ProductsService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let product = await ProductsService.getById(id);
            if (!product) {
                return Response.error(res, new createError.NotFound());
            }
            const { body } =req;
            if (!body || Object.keys(body).length === 0){
                return Response.error(res, new createError.BadRequest());
            }
            else{
                const productUpdated = await ProductsService.update(id, body);
                return Response.success(res, 200, 'Producto actualizado', productUpdated);
            }
        } catch (error){
            debug(error);
            return Response.error(res);
        }
    },
    deleteProduct: async (req, res) => {
        try{
            const { params: { id } } = req;
            if (!ProductsService.validate(id)) {
                return Response.error(res, new createError.BadRequest("ID no válido"));
            }
            let product = await ProductsService.getById(id);
            if (!product) {
                return Response.error(res, new createError.NotFound());
            }
            const productDeleted = await ProductsService.deleteById(id);
            return Response.success(res, 200, 'Producto eliminado', productDeleted);

        } catch (error){
            debug(error);
            return Response.error(res);
        }
    },

    generateReport: (req, res) => {
        try{
            ProductsService.generateReport("Inventario", res);
        } catch(error){
            debug(error);
            return Response.error(res);
        }
    },
};