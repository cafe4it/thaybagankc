Template.registerHelper('humanDate',function(date){
    return (date) ? moment(date).format('DD/MM/YYYY HH:mm:ss') : '';
});

Template.registerHelper('isDesktop', function(){
    return is.desktop();
});