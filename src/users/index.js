const express = require("express");

const { UsersController } = require('./controller');

const router = express.Router();

module.exports.UsersAPI = (app) => {
    router
    .get("/", UsersController.getUsers) //http://localhost:3000/api/products/
    .get("/:id", UsersController.getUser)
    .post("/", UsersController.createUser)
    .put("/:id", UsersController.updateUser)
    .delete("/:id", UsersController.deleteUser);

    app.use("/api/users", router);
}