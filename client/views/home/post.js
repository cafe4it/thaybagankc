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
    fb_postUrl: function () {
        var postTlp = _.template('https://www.facebook.com/bagankc/posts/<%=postId%>');
        return postTlp({
            postId: s.strRightBack(this._postId(), '_')
        })
    },
    autorun: function () {
        var self = this;
        var postId = self._postId();
        if (postId) {
            var subs = this.templateInstance.subscribe('getPost', postId);
            if (subs.ready()) {
                var title = self.post().title;
                document.title = title + ' | Thầy Ba Gàn | duongsinh.net';
                //FB.XFBML.parse();
            }
            /*if (!is.desktop()) {
                Meteor.call('fb_getPost', postId, function (error, result) {
                    if (error) console.error(error);
                    if (result) {
                        var result = EJSON.parse(result);
                        self.fb_post(result.message);
                    }
                });
            }*/

            Meteor.call('fb_fetchPost', postId , navigator.userAgent, function (error, result) {
                if (error) console.error(error);
                if (result) {
                    console.info(result);
                    self.fb_postContent(result);
                }
            });
        }
    }
});

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