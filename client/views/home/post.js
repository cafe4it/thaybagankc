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
    fb_postContent: undefined,
    fb_postComments: undefined,
    fb_postUrl: function () {
        var postTlp = _.template('https://www.facebook.com/bagankc/posts/<%=postId%>');
        return postTlp({
            postId: s.strRightBack(this._postId(), '_')
        })
    },
    onRendered: function () {
        if (is.desktop() || is.tablet()) {
            $(document).ready(function () {
                $(window).bind('scroll', function () {
                    var navHeight = 50; // custom nav height
                    if ($(window).scrollTop() > navHeight) {
                        $('#nav_post').addClass('goToBottom');
                        //$('#nav_post > div').addClass('goToBottom');
                    } else {
                        $('#nav_post').removeClass('goToBottom');
                        //$('#nav_post > div').removeClass('goToBottom');
                    }
                    //($(window).scrollTop() > navHeight) ? $('#nav_post').addClass('goToBottom') : $('#nav_post').removeClass('goToBottom');
                });
            })
        }
    },
    control: function () {
        return {
            previousUrl: this.previousUrl(),
            nextUrl: this.nextUrl()
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
            Meteor.call('fb_fetchPost', postId, navigator.userAgent, function (error, result) {
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
    onRendered: function () {
        $(document).ready(function () {
            //$("#tbl_comments").treetable();
        })
    },
    comments: function () {
        var obj = this.templateInstance.data;
        //var _comments = new Mongo.Collection(null);
        //console.log(obj.data);
        var _items = [];
        _.each(obj.data, function (i) {
            var parent_id = (i.parent) ? i.parent.id : '';
            var item = {
                id: i.id,
                parentId: parent_id,
                name: i.from.name,
                message: i.message,
                created_time: i.created_time
            };
            _items.push(item)
            //_comments.insert(item);
        })
        //console.warn(buildTreeOfComments(_items));
        //var items = _comments.find().fetch();
        return {
            count: (obj.summary.total_count) ? obj.summary.total_count : null,
            items: buildTreeOfComments(_items)
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

function buildTreeOfComments(items, parentId) {
    var comments_tmp = [];
    var parentId = parentId || '';
    _.each(items, function (i) {
        if (i.parentId === parentId) {
            comments_tmp.push(i);
            items = _.without(items, _.findWhere(items, {id: i.id}));
        }
    });
    if (comments_tmp && comments_tmp.length > 0) {
        var tableClass = (parentId === '') ? '' : 'subTable';
        var html = '<table class="table '+ tableClass+'">';
            html += '<tbody>';
        _.each(comments_tmp, function (i) {
            html += '<tr>';
            html += '<td style="padding: 5px !important;">';
            html += '<p class="comment_item">';
            html += '<b>'+ i.name+'</b> &nbsp; <span class="label label-default pull-right">'+ moment(i.created_time).format('DD/MM/YYYY HH:mm:ss') +'</span>'
            html += '</p>'
            html += '<p class="comment_item">'+ i.message.replace(/(?:\r\n|\r|\n)/g, '<br />') +'</p>'
            html += buildTreeOfComments(items.reverse(), i.id);
            html += '</td>';
            html += '</tr>'
        });
        html += '</tbody>'
        html += '</table>';
        return html;
    }
    return '';
}