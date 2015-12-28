if(Meteor.isClient){
    BlazeLayout.setRoot('body');
}

FlowRouter.route('/',{
    name : 'home',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{
            main : 'home'
        })
    }
});

FlowRouter.route('/nxcong',{
    name : 'admin_home',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{
            main : 'admin_home'
        })
    }
});

FlowRouter.route('/c/:key',{
    name : 'posts_list',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{
            main : 'posts_list'
        })
    }
});

FlowRouter.route('/p/:postId',{
    name : 'post_detail',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{
            main : 'post_detail'
        })
    }
})
