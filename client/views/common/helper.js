Template.registerHelper('humanDate',function(date){
    return (date) ? moment(date).format('DD/MM/YYYY HH:mm:ss') : '';
});

Template.registerHelper('isDesktopOrTablet', function(){
    return is.desktop() || is.tablet();
});

Template.registerHelper('convertToHtml',function(str){
    return (str) ? str.replace(/(?:\r\n|\r|\n)/g, '<br />') : str;
})