import mongoose from "mongoose";
import chai from "chai";
import bcrypt from "bcrypt";
import Users from "../../src/dao/Users.dao.js";
import { config } from "../../src/config.js";
import { createHash } from "../../src/utils.js";

const expect = chai.expect;

mongoose.connect(config.MONGODB_URI);

describe("Testing Users", () => {
    before(function() {
        this.usersDao = new Users();
    });
    after(async function() {
        const user = await this.usersDao.getBy({ email: "test@test" });
        if (user) {
            await this.usersDao.delete(user._id);
        }
    });

    it("El método GET de la ruta /api/users debe devolver un array de usuarios", async function(){
        const users = await this.usersDao.get();
        expect(users).to.be.an("array");
    });

    it("El método POST de la ruta /api/users debe devolver un objeto con el usuario creado", async function(){
        const mockUser = {
            first_name: "Test",
            last_name: "Test",
            email: "test@test",
            password: "test1234",
            pets: []
        };
        
        const createdUser = await this.usersDao.save({
            first_name: mockUser.first_name,
            last_name: mockUser.last_name,
            email: mockUser.email,
            password: createHash(mockUser.password),
            pets: mockUser.pets
        });
        const storedUser = await this.usersDao.getBy({ email: "test@test" });

        expect(createdUser).to.be.an("object");
        expect(storedUser).to.be.an("object");

        const isPasswordHashed = bcrypt.compareSync(mockUser.password, storedUser.password);
        expect(isPasswordHashed).to.be.true;
        expect(storedUser.password.slice(0, 4)).to.equal("$2b$");

        expect(storedUser.pets).to.be.an("array");

        expect(storedUser.first_name).to.be.an("string");
        expect(storedUser.last_name).to.equal(mockUser.last_name);
        expect(storedUser.email).to.equal(mockUser.email);
    });

    it("El método PUT de la ruta /api/users debe devolver un objeto con el usuario actualizado", async function(){
        const createdUser = await this.usersDao.getBy({ email: "test@test" });
        const updatedUser = await this.usersDao.update(createdUser._id, {
            first_name: "Test2",
            last_name: "Test2",
            email: "test2@test2",
            password: createHash("test1234"),
            pets: []
        });
        const storedUser = await this.usersDao.getBy({ email: "test2@test2" });

        expect(updatedUser).to.be.an("object");
        expect(storedUser).to.be.an("object");

        const isPasswordHashed = bcrypt.compareSync("test1234", storedUser.password);
        expect(isPasswordHashed).to.be.true;

        expect(storedUser.pets).to.be.an("array");

        expect(storedUser.first_name).to.equal("Test2");
        expect(storedUser.last_name).to.equal("Test2");
        expect(storedUser.email).to.equal("test2@test2");
    });

    it("El método GET de la ruta /api/users/:uid debe devolver un objeto con el usuario solicitado", async function(){
        const createdUser = await this.usersDao.getBy({ email: "test2@test2" });
        const user = await this.usersDao.getBy({_id:createdUser._id});
        expect(user).to.be.an("object");
        expect(user.first_name).to.equal("Test2");
        expect(user.last_name).to.equal("Test2");
        expect(user.email).to.equal("test2@test2");
        expect(user.pets).to.be.an("array");
        
        const isPasswordHashed = bcrypt.compareSync("test1234", user.password);
        expect(isPasswordHashed).to.be.true;
    });

    it("El método DELETE de la ruta /api/users/:uid debe devolver un objeto con el usuario eliminado", async function(){
        const createdUser = await this.usersDao.getBy({ email: "test2@test2" });
        const user = await this.usersDao.delete(createdUser._id);
        expect(user).to.be.an("object");
        expect(user.first_name).to.equal("Test2");
        expect(user.last_name).to.equal("Test2");
        expect(user.email).to.equal("test2@test2");
        expect(user.pets).to.be.an("array");
        
        const isPasswordHashed = bcrypt.compareSync("test1234", user.password);
        expect(isPasswordHashed).to.be.true;
    });
});
