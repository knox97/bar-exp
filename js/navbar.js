


var newHeight = Number($('.navbar').height()) + 16;
newHeight = String(newHeight);
$('.info-message').css('top', newHeight + 'px');
$('.content').css('padding-top', newHeight + 'px');