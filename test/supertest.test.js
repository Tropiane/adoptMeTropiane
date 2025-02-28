import chai from 'chai';
import supertest from 'supertest';
import Users from '../src/dao/Users.dao.js';
import mongoose from 'mongoose';
import { config } from '../src/config.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe("Testing adoptme", () => {
    before(async function () {
        try {
            
            this.usersDao = new Users();
    
            const user = await this.usersDao.getBy({ email: "test202502@test202502" });
            if (user) {
                await this.usersDao.delete(user._id);
            }
        } catch (error) {
            console.error("❌ Error conectando a MongoDB:", error);
            process.exit(1);
        }
    });

    beforeEach(async function () {
        this.timeout(8000);
        try {
            await mongoose.connect(config.MONGODB_URI);
    
            if (mongoose.connection.readyState !== 1) {
                console.error("⚠️ No se pudo conectar a MongoDB");
                process.exit(1);
            }
        } catch (error) {
            console.error("❌ Error conectando a MongoDB:", error);
            process.exit(1);
        }
    })

    after(async function () {
        try {
            await mongoose.disconnect();
            console.log("🔌 Desconectado de MongoDB después de los tests");
        } catch (error) {
            console.error("❌ Error al desconectar de MongoDB:", error);
        }
    });

    describe("test de mascotas", () => {

        it("El endpoint POST /api/pets debe crear una mascota correctamente", async () => {
            const petMock = {
                name: "test202502",
                specie: "test202502",
                birthdate: "10-10-2010",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/pets').send(petMock);
            expect(statusCode).to.equal(200);
            expect(ok).to.equal(true);
            expect(_body).to.have.property('status').to.equal('success');
        })

        it("El endpoint GET /api/pets debe retornar todas las mascotas", async () => {
            const {
                statusCode,
                ok,
                _body
            }= await requester.get('/api/pets');
            expect(statusCode).to.equal(200);
            expect(ok).to.equal(true);
            expect(_body).to.have.property('status').to.equal('success');
        })

        it("El endpoint PUT /api/pets/:pid debe actualizar una mascota", async () => {
            const petMock = {
                name: "test202502",
                specie: "test202502",
                birthdate: "10-10-2010",
            }
            const pet = await requester.post('/api/pets').send(petMock);
            const {
                statusCode,
                ok,
                _body
            }= await requester.put(`/api/pets/${pet._body.payload._id}`).send(petMock);
            expect(statusCode).to.equal(200);
            expect(ok).to.equal(true);
            expect(_body).to.have.property('status').to.equal('success');
        })

        it("El endpoint DELETE /api/pets/:pid debe eliminar una mascota", async () => {
            const petMock = {
                name: "test202502",
                specie: "test202502",
                birthdate: "11-07-2001",
            }
            const pet = await requester.post('/api/pets').send(petMock);
            const {
                statusCode,
                ok,
                _body
            }= await requester.delete(`/api/pets/${pet._body.payload._id}`);
            expect(statusCode).to.equal(200);
            expect(ok).to.equal(true);
            expect(_body).to.have.property('status').to.equal('success');
        })

        it("El endpoint POST /api/pets no debe crear una mascota sin el nombre", async () => {
            const petMock = {
                specie: "test202502",
                birthdate: "10-10-2010",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/pets').send(petMock);
            expect(statusCode).to.equal(500);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/pets no debe crear una mascota sin su especie", async () => {
            const petMock = {
                name: "test202502",
                birthdate: "10-10-2010",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/pets').send(petMock);
            expect(statusCode).to.equal(500);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/pets si debe crear una mascota sin su birthdate", async () => {
            const petMock = {
                name: "test202502",
                specie: "test202502",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/pets').send(petMock);
            expect(statusCode).to.equal(200);
            expect(ok).to.equal(true);
            expect(_body).to.have.property('status').to.equal('success');
        })
    })

    describe("test de usuarios", () => {
        it("El endpoint POST /api/users debe crear un usuario correctamente", async () => {
            const userMock = {
                first_name: "test202502",
                last_name: "test202502",
                email: "test202502@test202502",
                password: "test202502",
            };

            const res = await requester.post('/api/users').send(userMock);
            expect(res.statusCode).to.equal(200);
            expect(res.ok).to.equal(true);
            expect(res.body).to.have.property('status').to.equal('success');
        });

        it("El endpoint GET /api/users debe retornar todos los usuarios", async () => {
            const res = await requester.get('/api/users');
            expect(res.statusCode).to.equal(200);
            expect(res.ok).to.equal(true);
            expect(res.body).to.have.property('status').to.equal('success');
        });

        it("El endpoint PUT /api/users/:uid debe actualizar un usuario", async function () {

            const user = await this.usersDao.getBy({ email: "test202502@test202502" });
            
            const res = await requester.put(`/api/users/${user._id}`).send({
                first_name: "test202502",
                last_name: "test202502",
            });

            expect(res.statusCode).to.equal(200);
            expect(res.ok).to.equal(true);
            expect(res.body).to.have.property('status').to.equal('success');
        });
        

        it("El endpoint DELETE /api/users/:uid debe eliminar un usuario", async function(){
            const user = await this.usersDao.getBy({ email: "test202502@test202502" });
            const res = await requester.delete(`/api/users/${user._id}`);
            expect(res.statusCode).to.equal(200);
            expect(res.ok).to.equal(true);
            expect(res.body).to.have.property('status').to.equal('success');
        });

        it("El endpoint POST /api/users no debe crear un usuario sin el first_name", async () => {
            const userMock = {
                last_name: "test202502",
                email: "test202502@test202502",
                password: "test202502",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/users').send(userMock);
            expect(statusCode).to.equal(400);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/users no debe crear un usuario sin el last_name", async () => {
            const userMock = {
                first_name: "test202502",
                email: "test202502@test202502",
                password: "test202502",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/users').send(userMock);
            expect(statusCode).to.equal(400);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/users no debe crear un usuario sin el email", async () => {
            const userMock = {
                first_name: "test202502",
                last_name: "test202502",
                password: "test202502",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/users').send(userMock);
            expect(statusCode).to.equal(400);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/users no debe crear un usuario sin el password", async () => {
            const userMock = {
                first_name: "test202502",
                last_name: "test202502",
                email: "test202502@test202502",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/users').send(userMock);
            expect(statusCode).to.equal(400);
            expect(ok).to.equal(false);
            expect(_body).to.have.property('status').to.equal('error');
        })

        it("El endpoint POST /api/users no debe crear un usuario con un email ya existente", async () => {
            const userMock = {
                first_name: "test202502",
                last_name: "test202502",
                email: "test202502@test202502",
                password: "test202502",
            }
            try {
                const user = await requester.post('/api/users').send(userMock);
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/users').send(userMock);
                expect(statusCode).to.equal(500);
                expect(ok).to.equal(false);
                expect(_body).to.have.property('status').to.equal('error');
            } catch (error) {
                expect(error).to.be.an("error");
                
            }
        })
    })
})