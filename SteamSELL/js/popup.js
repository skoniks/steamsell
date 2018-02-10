$(function() {
    chrome.storage.local.get(null, function (data) {
        if(data.discount) $('#discount').val(data.discount);
		if(data.max_price) $('#max_price').val(data.max_price);
		if(data.steamp_prices) $('#prices').text(makeArray(data.steamp_prices).length);
        if(data.status) $('#status').text(data.status);
    });
	$.ajax({
        type: "GET",
        dataType: "json",
        url: "https://raw.githubusercontent.com/skoniks/steamsell/master/SteamSELL/manifest.json",
    }).done(function(manifest) {
		if(chrome.app.getDetails().version != manifest.version){
			$('#upd').text('Outdated! NEW: ' + manifest.version);
			$('#upd').show();
		}
    });
    $('#discount_save').click(function(){
		chrome.storage.local.set({
			'discount': $('#discount').val()
		});
    });
	$('#max_price_save').click(function(){
		chrome.storage.local.set({
			'max_price': $('#max_price').val()
		});
    });
	$('#update').click(function(){
		update();
    });
});
function update(){
    $('#status').text('Обновление...');
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://steamp.ru/prices?appid=730",
    }).done(function(steamp_prices) {
        if(!steamp_prices.success){
            $('#status').text('Ошибка!');
            return;
        }
		chrome.storage.local.set({
			'steamp_prices': steamp_prices.items,
		});
		$('#prices').text(makeArray(steamp_prices.items).length);
        $('#status').text('Обновлено!');
    });
}
function makeArray(object){
    var array = $.map(object, function(value, index) {
        return [value];
    });
    return array;
}