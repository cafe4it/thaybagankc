if(Meteor.isServer){
    Meteor.publish('getPostsByCategory',function(cateName, limit){
        return Posts.find({category : cateName}, {limit : limit || 50, sort : {created_time : -1}});
    });

    Meteor.publish('getPost', function(postId){
        return Posts.find({postId : postId});
    })
}