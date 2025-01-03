const { ObjectId } = require("mongodb");

const debug = require("debug")("app:module-sales-services");

const { Database } = require("../database/index");

const COLLECTION = "sales";

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

const create = async (sale) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(sale);
    return result.insertedId;
}


const deleteById = async (id) => {
    const objectId = new ObjectId(id); 
    const collection = await Database(COLLECTION); 
    await collection.deleteOne({ _id: objectId }); 
    return id;
}


module.exports.SalesService = {
    validate,
    getAll,
    getById,
    create,
    deleteById,
}