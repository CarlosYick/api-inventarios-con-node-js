const { ObjectId } = require("mongodb");

const debug = require("debug")("app:module-users-services");

const { Database } = require("../database/index");

const COLLECTION = "users";

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


module.exports.UsersService = {
    validate,
    getAll,
    getById,
    create,
    update,
    deleteById,
}