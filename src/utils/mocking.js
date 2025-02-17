import { faker } from '@faker-js/faker';

import { createHash } from '../utils.js';

const facker = faker;
export const generateMockPets = (number) => {
    const pets = [];

    for (let i = 0; i < number; i++) {
        pets.push({
            name: facker.animal.petName(),
            specie: facker.animal.cat(),
            birthDate: facker.date.past(),
            adopted: false
        })
        
    }
    return pets
}

export const generateMockUsers = (number)=>{
    const users = [];

    for (let i = 0; i < number; i++) {
        users.push({
            _id: faker.database.mongodbObjectId(),
            first_name: facker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            role: Math.random() > 0.5 ? "admin" : "user",
            password: createHash("coder123"),
            pets: []
        })
        
    }
    return users;
}