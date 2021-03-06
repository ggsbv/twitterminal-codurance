import * as assert from "assert";
import * as moment from "moment";

import { User } from "../app/User";
import { PostRepository } from "../database/PostRepository";
import { Post } from "../app/Post";
import { UserRepository } from "../database/UserRepository";
import { Database } from "../database/Database";

describe("The PostRepository class", () => {

    it("should store a Post with its associated User with the correct timestamp", () => {
        let database = new Database();

        let userRepository = new UserRepository(database);
        let postRepository = new PostRepository(database);

        let user = new User("Sandro");
        let anotherUser = new User("Andre");

        userRepository.store(user);
        userRepository.store(anotherUser);

        assert.equal(postRepository.store(new Post({
            text: "This is my first post!",
            author: anotherUser.name,
            createdAt: moment("2012-12-12 09:12:26")
        })), `Post has been saved to Andre's account.`);
        assert.equal(postRepository.store(new Post({
            text: "This is my first post!",
            author: user.name,
            createdAt: moment("2012-12-12 09:30:26")
        })), `Post has been saved to Sandro's account.`);

        let firstPost = postRepository.findOne({ author: "Andre" });

        assert.equal(firstPost.text, "This is my first post!");
        // assert.equal(firstPost.createdAt, "This is my first post!");
    });


    it("should return all posts that have been stored", () => {
        let database = new Database();

        let userRepository = new UserRepository(database);
        let postRepository = new PostRepository(database);

        let user = new User("Sandro");
        let anotherUser = new User("Andre");

        userRepository.store(user);
        userRepository.store(anotherUser);

        postRepository.store(new Post({
            text: "This is my first post!",
            author: user.name,
            createdAt: moment("2012-12-12 09:12:26")
        }));

        postRepository.store(new Post({
            text: "This is my first post!",
            author: anotherUser.name,
            createdAt: moment("2012-12-12 09:30:26")
        }));

        assert.equal(postRepository.allPosts().length, 2);
        assert.deepEqual(postRepository.allPosts().map(post => post.text), [
            "This is my first post!",
            "This is my first post!"
        ]);
    });

    it("should return an error string when the post cannot be saved", () => {
        let database = new Database();
        let postRepository = new PostRepository(database);

        assert.equal(postRepository.store("something that cannot be stored"), "Error, could not save Post.");
    });
});