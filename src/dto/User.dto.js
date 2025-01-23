import { createHash } from "../utils/index.js"

export default class UserDTO{
    constructor(user){
        this.first_name = String(user.first_name),
        this.last_name = String(user.last_name),
        this.email= String(user.email),
        this.role= String(user.role),
        this.password = createHash(user.password)
    }

};