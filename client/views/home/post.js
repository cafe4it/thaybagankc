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
    control : function(){
        return {
            previousUrl : this.previousUrl(),
            nextUrl : this.previousUrl()
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
                    //console.info(result);
                    self.fb_postContent(result.post);
                    self.fb_postComments(result.comments);
                }
            });
        }
    }
});

/*Template.nav_control.viewmodel({
    onCreated : function(){
        console.log(this.data())
    }
})*/

Template.post_comments.viewmodel({
    onRendered : function(){
        $(document).ready(function(){
            $("#tbl_comments").treetable();
        })
    },
    comments : function(){
        var obj = this.templateInstance.data;
        var _comments = new Mongo.Collection(null);
        _.each(obj.data, function(i){
            var parent_id = (i.parent) ? i.parent.id : null;
            _comments.insert({
                id : i.id,
                parentId : parent_id,
                name : i.from.name,
                message : i.message,
                created_time : i.created_time
            });
        })
        var items = _comments.find({},{sort : {created_time : 1}}).fetch();
        console.warn(builddata(items));
        return {
            count : (obj.summary.total_count) ? obj.summary.total_count : null,
            items : items
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

var builddata = function (data) {
    var source = [];
    var items = [];
    // build hierarchical source.
    for (i = 0; i < data.length; i++) {
        var item = data[i];
        var label = item["message"];
        var parentid = item["parentId"];
        var id = item["id"];

        if (items[parentid]) {
            var item = { parentId: parentid, message: label, item: item };
            if (!items[parentid].items) {
                items[parentid].items = [];
            }
            items[parentid].items[items[parentid].items.length] = item;
            items[id] = item;
        }
        else {
            items[id] = { parentId: parentid, message: label, item: item };
            source[id] = items[id];
        }
    }
    return source;
}