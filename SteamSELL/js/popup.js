$(function() {
    chrome.storage.local.get(null, function (data) {
        var percent = data.percent;
        if(percent) $('#percent').val(percent);
    });
    $('#update').click(function(){
        update();
    });
});
function update(){
    $('#status').text('Обновление');
    var appid = $('#appid').val();
    var cur = $('#cur').val();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://steamp.ru/prices?appid=" + appid + "&cur=" + cur,
    }).done(function(steamp_prices) {
        if(!steamp_prices.success){
            $('#status').text('Ошибка!');
            return;
        }
        var result = {
            'steamp_prices': steamp_prices.items,
            'percent': $('#percent').val(),
            'sell': true,
            'appid': appid,
        };
        chrome.storage.local.set(result);
        $('#status').text('Начинаем продажу!');
    });
}
function makeArray(object){
    var array = $.map(object, function(value, index) {
        return [value];
    });
    return array;
}