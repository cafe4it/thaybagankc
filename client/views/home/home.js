Template.home.viewmodel({
    feeds : [],
    autorun : function(){
        var self = this;
        Meteor.call('pageFeed', 'bagankc', 50, function(error, result){
            if(error) console.error(error);
            var result = JSON.parse(result);
            if(result && result.data){
                var messages = _.map(result.data, function(i){
                    var created_time = moment(i.created_time).format('DD/MM/YYYY HH:mm:ss');
                    var shortMessage = s.truncate(i.message, 100);
                    return _.extend(i, { created_time : created_time, shortMessage : shortMessage});
                });
                self.feeds(messages);
            }
        })
    }
})