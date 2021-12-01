const UserModel = require('./user');
const CommentsModel = require('./comments')
const StatusModel = require('./posts')
const BlogModel = require('./blog')
const PostsModel = require('./posts');

UserModel.hasMany(PostsModel);
UserModel.hasMany(CommentsModel);
UserModel.hasMany(BlogModel);

PostsModel.belongsTo(UserModel);
PostsModel.hasMany(CommentsModel);

CommentsModel.belongsTo(PostsModel);

module.exports = {
    UserModel,
    CommentsModel,
    StatusModel,
    BlogModel,
    PostsModel

}

