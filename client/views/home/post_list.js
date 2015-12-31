Template.posts_list.viewmodel({
    category: function () {
        var key = FlowRouter.getParam('key');
        var cats = Meteor.settings.public.categories || [];
        return _.findWhere(cats, {key: key});
    },
    posts: undefined,
    _limit: 50,
    _loaded: 0,
    _hasMorePosts: function () {
        return (this.posts()) ? this.posts().count() >= this._limit() : false;
    },
    _getMorePosts: function (e) {
        e.preventDefault();
        var limit = this._limit();
        limit += limit;
        this._limit(limit);
    },
    autorun: function () {
        var category = this.category();
        if (category) {
            var limit = this._limit();
            if(document.title != category.value){
                this.reset();
            }
            document.title = category.value;
            this.posts(undefined);
            var subs = this.templateInstance.subscribe('getPostsByCategory', category.key, limit);
            if (subs.ready()) {
                this._loaded(limit);
                this.posts(Posts.find({category: category.key}, {sort: {created_time: -1}, limit: this._loaded()}));
            }
        }
    }
})