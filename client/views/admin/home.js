var Feeds = new Mongo.Collection(null);

Template.admin_home.viewmodel({
    feeds: function(){
        return Feeds.find();
    },
    pageUrl: '',
    nextPageUrl: '',
    prevPageUrl: '',
    goToPage : function(pageUrl){
        if(pageUrl){
            this.pageUrl(pageUrl);
        }
    },
    autorun: function () {
        var self = this;
        var pageUrl = self.pageUrl();
        Meteor.call('fb_getFeeds', pageUrl, function (error, result) {
            try{
                if (error) console.error(error);
                var result = EJSON.parse(result);
                if (result && result.data) {
                    var messages = _.each(result.data, function (i) {
                        var shortMessage = (i.message) ? s.truncate(i.message, 100) : i.story;
                        Feeds.insert(_.extend(i, {shortMessage: shortMessage}));
                    });

                    if(result.paging){
                        self.nextPageUrl(result.paging.next || '');
                        self.prevPageUrl(result.paging.previous || '');
                    }
                }
            }catch(ex){
                console.error('Exception : ', ex);
            }
        })
    }
});

Template.feed_item.viewmodel({
    addToCategory : function(e){
        e.preventDefault();
        var data = this.data();
        console.log(data);
        var modalId = Blaze.renderWithData(Template.dlg_addToCategory, data, document.getElementsByTagName('body')[0]);
        $('#dlg_addToCategory').modal('show').on('hidden.bs.modal', function (e) {
            Blaze.remove(modalId);
        });
    }
});

Template.dlg_addToCategory.viewmodel({
    selectedCategory : '',
    postId : function(){
        return this.templateInstance.data.id;
    },
    title : '',
    categories : function(){
        return Meteor.settings.public.categories || [];
    },
    isValid : function(){
        return (this.postId() && this.title() && this.selectedCategory());
    },
    saveToDb : function(e){
        e.preventDefault();
        if(this.isValid()){
            var item = {
                postId : this.postId(),
                title : this.title(),
                category : this.selectedCategory(),
                created_time : new Date(this.templateInstance.data.created_time)
            }
            Meteor.call('importPost', item, function(error, result){
                console.log(error, result);
            })
        }
    }
})