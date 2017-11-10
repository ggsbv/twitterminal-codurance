import * as assert from "assert";

import { User } from "../app/User";
import { UserRepository } from "../database/UserRepository";
import { Database } from "../database/Database";

describe("The UserRepository Class", () => {

    it("Should store a user in the database", () => {
        let database = new Database();
        let userRepository = new UserRepository(database);

        assert.equal(userRepository.store(new User("Sandro")), "User: 'Sandro' successfully saved to the database.");
        assert.equal(userRepository.findOne({ name: "Sandro" }).name, "Sandro");
    })

});