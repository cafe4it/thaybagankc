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
        fb_getPost : function(postId){
            try {
                var facebookSettings = Meteor.settings.private.facebook;
                var graphTpl = _.template('https://graph.facebook.com/v2.5/<%=postId%>?access_token=<%=token%>');
                if (facebookSettings && postId) {
                    var token = facebookSettings.token;
                    var graphUrl = graphTpl({postId : postId,token: encodeURI(token)});
                    var r = request.getSync(graphUrl, {encoding: 'utf8'});
                    return r.body;
                }
            } catch (ex) {
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        },
        importPost : function(item){
            try{
                check(item,{
                    postId : String,
                    title : String,
                    category : String,
                    created_time : Date
                });

                var importedAt = new Date();
                Posts.upsert({postId : item.postId}, _.extend(item, {importedAt : importedAt}));
                return true;
            }catch(ex){
                console.log('Error', ex.message);
                throw new Meteor.Error(ex);
            }
        }
    })
}