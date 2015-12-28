Template.post_detail.viewmodel({
    _postId : function(){
        return FlowRouter.getParam('postId');
    },
    post : function(){
        if(this._postId()){
            return Posts.findOne({postId : this._postId()});
        }
    },
    fb_post : undefined,
    autorun : function(){
        var self = this;
        var postId = self._postId();
        if(postId){
            var subs = this.templateInstance.subscribe('getPost', postId);
            if(subs.ready()){
                var title = self.post().title;
                document.title =  title+ ' | Thầy Ba Gàn | duongsinh.net';
            }
            Meteor.call('fb_getPost', postId, function(error, result){
                if(error) console.error(error);
                if(result){
                    var result = EJSON.parse(result);
                    self.fb_post(result.message);
                }
            })
        }
    }
})