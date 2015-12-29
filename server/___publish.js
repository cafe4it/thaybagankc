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
            _No = parseInt(current.orderNo),
            cat = current.category;
        var arr = [_No - 1, _No, _No + 1];
        return Posts.find({category : cat, orderNo : {$in : arr}});
    })
}