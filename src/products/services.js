const { ObjectId } = require("mongodb");

const { Database } = require("../database/index");
const { ProductsUtils } = require("./utils");

const COLLECTION = "products";

const validate = (id) => {
    return ObjectId.isValid(id);
};

const getAll = async () => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const objectId = new ObjectId(id);
    const collection = await Database(COLLECTION);
    return collection.findOne({ _id: objectId });
}

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(product);
    return result.insertedId;
}

const update = async (id, updateData) => {
    const objectId = new ObjectId(id);
    const collection = await Database(COLLECTION);
    const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: 'after' }
    );
    return result;
}

const deleteById = async (id) => {
    const objectId = new ObjectId(id); 
    const collection = await Database(COLLECTION); 
    await collection.deleteOne({ _id: objectId }); 
    return id;
}

const generateReport = async (name, res) => {
    let products = await getAll();
    ProductsUtils.excelGenerator(products, name, res);
}

const updateProductQuantity = async (id, quantity) => {
    const collection = await Database(COLLECTION);
    const objectId = new ObjectId(id);
    const result = await collection.updateOne(
        { _id: objectId },
        { $inc: { cantidad: -quantity } } // Decrementar la cantidad de productos
    );
    //return result.modifiedCount;
};

const getProductQuantity = async (id) => {
    const collection = await Database(COLLECTION);
    const objectId = new ObjectId(id);

    const product = await collection.findOne({ _id: objectId }, { projection: { cantidad: 1 } });

    return product.cantidad;
};



module.exports.ProductsService = {
    validate,
    getAll,
    getById,
    create,
    update,
    deleteById,
    generateReport,
    updateProductQuantity,
    getProductQuantity
}