if (Meteor.isServer) {
    Meteor.methods({
        fb_getFeeds: function (pageUrl) {
            try {
                var facebookSettings = Meteor.settings.private.facebook;
                var feedUrl = _.template('https://graph.facebook.com/v2.5/bagankc/feed?limit=100&access_token=<%=token%>');
                if (facebookSettings) {
                    var token = facebookSettings.token;
                    var pageUrl = pageUrl || feedUrl({token: encodeURI(token)});
                    var r = request.getSync(pageUrl, {encoding: 'utf8'});
                    return r.body;
                }
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        },
        fb_getPost: function (postId) {
            try {
                var facebookSettings = Meteor.settings.private.facebook;
                var graphTpl = _.template('https://graph.facebook.com/v2.5/<%=postId%>?access_token=<%=token%>');
                if (facebookSettings && postId) {
                    var token = facebookSettings.token;
                    var graphUrl = graphTpl({postId: postId, token: encodeURI(token)});
                    var r = request.getSync(graphUrl, {encoding: 'utf8'});
                    return r.body;
                }
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        },
        fb_getEmbedPost: function (postId, UA) {
            try {
                var postTlp = _.template('https://www.facebook.com/bagankc/posts/<%=postId%>');
                var embedTpl = _.template('https://www.facebook.com/plugins/post/oembed.json/?url=<%=postUrl%>');
                if (postId) {
                    var _postId = s.strRightBack(postId, '_');
                    var postUrl = postTlp({postId: _postId}),
                        embedUrl = embedTpl({postUrl: postUrl});
                    var r = request.getSync(embedUrl, {
                        headers: {
                            'User-Agent': UA || 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:43.0) Gecko/20100101 Firefox/43.0'
                        }
                    });
                    var result = EJSON.parse(r.body);
                    if (result && result.html) {
                        console.log(result.html);
                        var rs = Async.runSync(function (done) {
                            var x = Xray();
                            x(result.html, 'body', {
                                image: 'img.img@src'
                            })(function (error, data) {
                                done(error, data);
                            })
                        });

                        if (rs.error) throw new Meteor.Error(rs.error);
                        if (rs.result) return rs.result;
                    }
                }
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        },
        fb_fetchPost: function (postId, UA) {
            try {
                var postTlp = _.template('https://graph.facebook.com/v2.5/<%=postId%>?fields=picture%2Cfull_picture%2Cmessage&access_token=<%=token%>');
                var facebookSettings = Meteor.settings.private.facebook;
                if(facebookSettings && postId){
                    var token = facebookSettings.token;
                    var postUrl = postTlp({postId : postId, token : token});
                    var r = request.getSync(postUrl,{
                        headers: {
                            'User-Agent': UA || 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:43.0) Gecko/20100101 Firefox/43.0'
                        },
                        encoding: 'utf8'
                    });
                    var result = JSON.parse(r.body);
                    var fbPost = {
                        post : result
                    }

                    var commentsInfoTpl = _.template('https://graph.facebook.com/v2.5/<%=postId%>/comments?access_token=<%=token%>&summary=1&filter=stream&order=reverse_chronological'),
                        commentsInfoUrl = commentsInfoTpl({token : token, postId : postId});
                    r = request.getSync(commentsInfoUrl,{
                        headers: {
                            'User-Agent': UA || 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:43.0) Gecko/20100101 Firefox/43.0'
                        },
                        encoding: 'utf8'
                    });

                    result = JSON.parse(r.body);
                    return _.extend(fbPost,{ comments : result});
                }
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        },
        importPost: function (item) {
            try {
                check(item, {
                    postId: String,
                    title: String,
                    category: String,
                    created_time: Date
                });

                var importedAt = new Date();
                Posts.upsert({postId: item.postId}, _.extend(item, {importedAt: importedAt}));
                return true;
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        }
    })
}