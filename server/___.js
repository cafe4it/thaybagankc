if(Meteor.isServer){
    Meteor.methods({
        pageFeed : function(pageId, limit, sort){
            try{
                var facebookSettings = Meteor.settings.private.facebook;
                var feedUrl = _.template('https://graph.facebook.com/v2.5/<%=pageId%>/feed?limit=<%=limit%>&access_token=<%=token%>');
                if(facebookSettings){
                    var token = facebookSettings.token;
                    var pageId = pageId || 'bagankc',
                        limit = limit || 50;
                    var r = request.getSync(feedUrl({pageId : pageId, limit : limit, token : token}),{encoding : 'utf8'});
                    return r.body;
                }
            }catch(ex){
                throw new Meteor.Error(ex);
            }
        }
    })
}