Template.widget_top5posts.viewmodel({
    category : function(){
        var cats = Meteor.settings.public.categories || [];
        var cateId = this.templateInstance.data.cateId;
        return _.findWhere(cats, {key : cateId});
    },
    posts : function(){
        return Posts.find({category : this.category().key});
    },
    autorun : function(){
        var category = this.category();
        document.title = 'Thầy Ba Gàn | Duongsinh.net';
        if(category){
            var subs = this.templateInstance.subscribe('getPostsByCategory', category.key, 5);
        }
    }
})