Template.post_detail.viewmodel({
    _postId: function () {
        return FlowRouter.getParam('postId');
    },
    previousUrl: function () {
        return buildPageUrl(this.post(), 'lt');
    },
    nextUrl: function () {
        return buildPageUrl(this.post(), 'gt');
    },
    post: function () {
        if (this._postId()) {
            return Posts.findOne({postId: this._postId()});
        }
    },
    fb_post: undefined,
    fb_postContent : undefined,
    fb_postComments : undefined,
    fb_postUrl: function () {
        var postTlp = _.template('https://www.facebook.com/bagankc/posts/<%=postId%>');
        return postTlp({
            postId: s.strRightBack(this._postId(), '_')
        })
    },
    onRendered : function(){
        if(is.desktop() || is.tablet()){
            $(document).ready(function(){
                $(window).bind('scroll', function() {
                    var navHeight = 50; // custom nav height
                    if($(window).scrollTop() > navHeight){
                        $('#nav_post').addClass('goToBottom');
                        //$('#nav_post > div').addClass('goToBottom');
                    }else{
                        $('#nav_post').removeClass('goToBottom');
                        //$('#nav_post > div').removeClass('goToBottom');
                    }
                    //($(window).scrollTop() > navHeight) ? $('#nav_post').addClass('goToBottom') : $('#nav_post').removeClass('goToBottom');
                });
            })
        }
    },
    autorun: function () {
        var self = this;
        var postId = self._postId();
        if (postId) {
            var subs = this.templateInstance.subscribe('getPost', postId);
            if (subs.ready()) {
                var title = self.post().title;
                document.title = title + ' | Thầy Ba Gàn | duongsinh.net';
            }

            self.fb_postContent(undefined);
            self.fb_postComments(undefined);
            Meteor.call('fb_fetchPost', postId , navigator.userAgent, function (error, result) {
                if (error) console.error(error);
                if (result) {
                    console.info(result);
                    self.fb_postContent(result.post);
                    self.fb_postComments(result.comments);
                }
            });
        }
    }
});

Template.post_comments.viewmodel({
    comments : function(){
        var obj = this.templateInstance.data;
        return {
            count : (obj.summary.total_count) ? obj.summary.total_count : null,
            items : obj.data
        }
    }
})

function buildPageUrl(currentPost, jjj) {
    var url = null;
    if (currentPost) {
        var currCreated_time = currentPost.created_time,
            cat = currentPost.category,
            param = (jjj === 'lt') ? {
                created_time: {$lt: currCreated_time},
                category: cat
            } : {created_time: {$gt: currCreated_time}, category: cat};
        var _Post = Posts.findOne(param);
        if (_Post) {
            url = FlowRouter.path('post_detail', {key: _Post.category, postId: _Post.postId});
        }
    }
    return url;
}