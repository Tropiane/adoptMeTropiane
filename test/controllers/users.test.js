import mongoose from "mongoose";
import Assert from "assert";
import { expect } from 'chai';
import Users from "../../src/dao/Users.dao.js";
import { config } from "../../src/config.js";

const assert = Assert.strict;

mongoose.connect(config.MONGODB_URI);

describe("Testing Users", () => {
    before(function() {
        this.usersDao = new Users();
    })
    it("La ruta /users/get debería devolver un array de usuarios", async function() {
        const users = await this.usersDao.get({});
        assert.equal(Array.isArray(users), true);
        
    });
})
