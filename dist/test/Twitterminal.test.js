"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var Twitterminal_1 = require("../app/Twitterminal");
var UserRepository_1 = require("../database/UserRepository");
var PostCommand_1 = require("../app/PostCommand");
var Database_1 = require("../database/Database");
var PostRepository_1 = require("../app/PostRepository");
var ReadCommand_1 = require("../app/ReadCommand");
var Timeline_1 = require("../app/Timeline");
var FollowCommand_1 = require("../app/FollowCommand");
var WallCommand_1 = require("../app/WallCommand");
var Wall_1 = require("../app/Wall");
describe("The Twitterminal Class", function () {
    it("should create a User when the input from the console is in the format of 'username -> hello!'", function () {
        var database = new Database_1.Database();
        var userRepository = new UserRepository_1.UserRepository(database);
        var postRepository = new PostRepository_1.PostRepository(database);
        var postCommand = new PostCommand_1.PostCommand();
        var availableCommands = [
            postCommand
        ];
        var twitterminal = new Twitterminal_1.Twitterminal(availableCommands, userRepository, postRepository);
        twitterminal.handleInput("Sandro -> This is first post!");
        assert.equal(userRepository.findOne({ name: "Sandro" }).name, "Sandro");
    });
    it("should save a Post to a User when the input command's 'verb' is '->'", function () {
        var database = new Database_1.Database();
        var userRepository = new UserRepository_1.UserRepository(database);
        var postRepository = new PostRepository_1.PostRepository(database);
        var postCommand = new PostCommand_1.PostCommand();
        var availableCommands = [
            postCommand
        ];
        var twitterminal = new Twitterminal_1.Twitterminal(availableCommands, userRepository, postRepository);
        twitterminal.handleInput("Sandro -> This is my first post!");
        twitterminal.handleInput("Sandro -> This is my second post...");
        assert.deepEqual(userRepository.findOne({ name: "Sandro" }).posts.map(function (post) { return post.text; }), [
            "This is my first post!",
            "This is my second post..."
        ]);
    });
    it("should display the User's timeline when the input command's subject is only a user name", function () {
        var database = new Database_1.Database();
        var userRepository = new UserRepository_1.UserRepository(database);
        var postRepository = new PostRepository_1.PostRepository(database);
        var postCommand = new PostCommand_1.PostCommand();
        var readCommand = new ReadCommand_1.ReadCommand();
        var availableCommands = [
            postCommand,
            readCommand
        ];
        var twitterminal = new Twitterminal_1.Twitterminal(availableCommands, userRepository, postRepository);
        twitterminal.handleInput("Sandro -> This is my first post!");
        twitterminal.handleInput("Sandro -> This is my second post!");
        twitterminal.handleInput("Sandro");
        var sandroPosts = userRepository.findOne({ name: "Sandro" }).posts;
        var sandroTimeline = new Timeline_1.Timeline(sandroPosts);
        assert.deepEqual(sandroTimeline.posts.sort(), [
            "This is my first post! (a few seconds ago)",
            "This is my second post! (a few seconds ago)"
        ]);
    });
    it("should add a User to another User's subscriptions list when the input verb is 'follow'", function () {
        var database = new Database_1.Database();
        var userRepository = new UserRepository_1.UserRepository(database);
        var postRepository = new PostRepository_1.PostRepository(database);
        var postCommand = new PostCommand_1.PostCommand();
        var readCommand = new ReadCommand_1.ReadCommand();
        var followCommand = new FollowCommand_1.FollowCommand();
        var availableCommands = [
            postCommand,
            readCommand,
            followCommand
        ];
        var twitterminal = new Twitterminal_1.Twitterminal(availableCommands, userRepository, postRepository);
        twitterminal.handleInput("Sandro -> First post");
        twitterminal.handleInput("Andre -> First post");
        twitterminal.handleInput("Charne -> First post");
        twitterminal.handleInput("Sandro follows Andre");
        twitterminal.handleInput("Sandro follows Charne");
        assert.deepEqual(userRepository.findOne({ name: "Sandro" }).subscribedTo, [
            "Andre",
            "Charne"
        ]);
    });
    it("should display a User's wall when the input command verb is the word 'wall'", function () {
        var database = new Database_1.Database();
        var userRepository = new UserRepository_1.UserRepository(database);
        var postRepository = new PostRepository_1.PostRepository(database);
        var postCommand = new PostCommand_1.PostCommand();
        var readCommand = new ReadCommand_1.ReadCommand();
        var followCommand = new FollowCommand_1.FollowCommand();
        var wallCommand = new WallCommand_1.WallCommand();
        var availableCommands = [
            postCommand,
            readCommand,
            followCommand,
            wallCommand
        ];
        var twitterminal = new Twitterminal_1.Twitterminal(availableCommands, userRepository, postRepository);
        twitterminal.handleInput("Sandro -> First post");
        twitterminal.handleInput("Sandro -> Second post");
        twitterminal.handleInput("Andre -> First post");
        twitterminal.handleInput("Charne -> First post");
        twitterminal.handleInput("Charne follows Sandro");
        twitterminal.handleInput("Charne follows Andre");
        var charneWall = new Wall_1.Wall(userRepository.findOne({ name: "Charne" }), userRepository);
        assert.deepEqual(charneWall.posts.sort(), [
            "Andre - First post (a few seconds ago)",
            "Charne - First post (a few seconds ago)",
            "Sandro - First post (a few seconds ago)",
            "Sandro - Second post (a few seconds ago)"
        ]);
        // assert.equal(twitterminal.handleInput("Charne wall"), "Wall has been logged to the console.");
    });
});