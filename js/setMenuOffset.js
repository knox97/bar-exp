

var offset = Number($('.btn-save-menu').height()) + 35;
var newHeight = Number($('.navbar').height());
newHeight = String(newHeight);
$('.info-message').css('top', newHeight + 'px');
$('.error-message').css('top', newHeight + 'px');
$('.success-message').css('top', newHeight + 'px');
$('#menuList').css('margin-bottom', offset + 'px');
$('.orderList').css('margin-bottom', offset + 'px');
$('.foodList').css('margin-bottom', offset + 'px');
$('.payingList').css('margin-bottom', offset + 'px');
offset += 17;
$('.btn-save-wrap').css('height', offset + 'px');
$('.btn-save-wrap').animate({opacity: '1'});
$('.btn-save-menu').animate({opacity: '1'});