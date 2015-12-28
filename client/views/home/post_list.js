Template.posts_list.viewmodel({
    category : function(){
        var key = FlowRouter.getParam('key');
        var cats = Meteor.settings.public.categories || [];
        return _.findWhere(cats, {key : key});
    },
    posts : function(){
        var categoryName = this.category().key || '';
        return Posts.find({category : categoryName},{sort : {created_time : -1}, limit : this._loaded()});
    },
    _limit : 50,
    _loaded : 0,
    autorun : function(){
        var categoryName = this.category().key || undefined;
        var limit = this._limit();
        if(categoryName){
            var subs = this.templateInstance.subscribe('getPostsByCategory', categoryName, limit);
            if(subs.ready()){
                this._loaded(limit);
            }
        }
    }
})