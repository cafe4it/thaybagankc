Template.post_detail.viewmodel({
    _postId: function () {
        return FlowRouter.getParam('postId');
    },
    previousUrl: function () {
        return buildPageUrl(this.post(), 1);
    },
    nextUrl: function () {
        return buildPageUrl(this.post(), -1);
    },
    post: function () {
        if (this._postId()) {
            return Posts.findOne({postId: this._postId()});
        }
    },
    fb_post: undefined,
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
                FB.XFBML.parse();
            }
            if (!is.desktop()) {
                Meteor.call('fb_getPost', postId, function (error, result) {
                    if (error) console.error(error);
                    if (result) {
                        var result = EJSON.parse(result);
                        self.fb_post(result.message);
                    }
                });
            }
        }
    }
});

function buildPageUrl(currentPost, step) {
    var url = null;
    if (currentPost) {
        var currNo = currentPost.orderNo,
            cat = currentPost.category,
            preNo = currNo - (step);
        var _Post = Posts.findOne({orderNo: preNo, category: cat});
        if (_Post) {
            url = FlowRouter.path('post_detail', {key: _Post.category, postId: _Post.postId});
        }
    }
    return url;
}