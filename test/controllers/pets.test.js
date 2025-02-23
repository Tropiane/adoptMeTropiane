import mongoose from "mongoose";
import chai from "chai";
import Pet from "../../src/dao/Pets.dao.js";
import { config } from "../../src/config.js";

const expect = chai.expect;

mongoose.connect(config.MONGODB_URI);

describe("Testing Pets", () => {
    before(async function(){
        this.petDao = new Pet();
    })
    after(async function(){
        const pet1 = await this.petDao.getBy({name: "test"});
        const pet2 = await this.petDao.getBy({name: "test2"});
        pet1 && await this.petDao.delete(pet1._id);
        pet2 && await this.petDao.delete(pet2._id);
        setTimeout(() => {
            mongoose.disconnect();
        }, 1000);
    });

    it("El método GET de la ruta /api/pets debe devolver un array de mascotas", async function(){
        const pets = await this.petDao.get();
        expect(pets).to.be.an("array");
    })

    it("El método POST de la ruta /api/pets debe crear una mascota", async function(){
        const petMock = {
            name: "test",
            age: 3,
            specie: "test",
            adopted: false,
            birthDate: new Date(),
            image: "test"
        }
        const pet = await this.petDao.save({name: petMock.name, age: petMock.age, specie: petMock.specie, adopted: petMock.adopted, birthDate: petMock.birthDate, image: petMock.image});
        expect(pet).to.be.an("object");
        expect(pet.name).to.equal(petMock.name);
        expect(pet.specie).to.equal(petMock.specie);
    });

    it("El método PUT de la ruta /api/pets/:pid debe actualizar una mascota", async function(){
        const petMock = await this.petDao.getBy({name: "test"});
        await this.petDao.update(petMock._id, {name: "test2"});
        const pet = await this.petDao.getBy({name: "test2"});
        expect(pet).to.be.an("object");
        expect(pet.name).to.equal("test2");
    });

    it("El método DELETE de la ruta /api/pets/:pid debe eliminar una mascota", async function(){
        const petMock = await this.petDao.getBy({name: "test2"});
        const pet = await this.petDao.delete(petMock._id);
        expect(pet).to.be.an("object");
        expect(pet.specie).to.equal("test");
    });

    it("El método POST de la ruta /api/pets/withimage debe crear una mascota con imagen", async function(){
        const petMock = {
            name: "test",
            age: 3,
            specie: "test",
            adopted: false,
            birthDate: new Date(),
            image: "../../src/public/img/1671549990926-coderDog.jpg"
        }
        const pet = await this.petDao.save({name: petMock.name, age: petMock.age, specie: petMock.specie, adopted: petMock.adopted, birthDate: petMock.birthDate, image: petMock.image});
        expect(pet).to.be.an("object");        
        expect(pet.image).to.be.an("string");
    });
});