"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var find = require("lodash.find");
var flattenDeep = require("lodash.flattendeep");
var PostRepository = /** @class */ (function () {
    function PostRepository(database) {
        this.database = database;
    }
    PostRepository.prototype.allPosts = function () {
        return flattenDeep(this.database.data.map(function (user) { return user.posts; }));
    };
    PostRepository.prototype.store = function (post) {
        try {
            return find(this.database.data, function (user) { return user.name === post.author; }).post(post);
        }
        catch (_a) {
            return "Error, could not save Post.";
        }
    };
    // find(query: any): Array<Post> {
    //     return filter(this.allPosts(), post => query);
    // }
    PostRepository.prototype.findOne = function (query) {
        return find(this.allPosts(), function (post) { return query; });
    };
    return PostRepository;
}());
exports.PostRepository = PostRepository;
