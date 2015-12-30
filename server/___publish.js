if (Meteor.isServer) {
    Meteor.publish('getPostsByCategory', function (cateName, limit) {
        return Posts.find({category: cateName}, {limit: limit || 50, sort: {created_time: -1}});
    });

    Meteor.publish('getPostById', function(postId){
        var data = Posts.find({postId : postId});
        if(data){
            return data;
        }else{
            return this.ready();
        }
    })

    Meteor.publish('getPost', function (postId) {
        var current = Posts.findOne({postId: postId}),
            previous = Posts.findOne({created_time : {$lt : current.created_time}, category : current.category},{sort : {created_time:-1}}),
            next = Posts.findOne({created_time : {$gt : current.created_time}, category : current.category},{sort : {created_time:1}}),
            arr = [(previous) ? previous._id : '', current._id, (next) ? next._id : ''];
        return Posts.find({_id : {$in : arr}});
    })
}