import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe("Testing adoptme", () => {
    describe("test de mascotas", () => {
        it("El endpont POST /api/pets debe crear una mascota correctamente", async () => {
            const petMock = {
                name: "Firulais",
                specie: "test202502",
                birthdate: "10-10-2010",
            }
            const {
                statusCode,
                ok,
                _body
            }= await requester.post('/api/pets').send(petMock);
            console.log(statusCode);
            console.log(ok);
            console.log(_body);
        })
    })
})