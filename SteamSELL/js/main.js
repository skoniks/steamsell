console.log('SteamSELL init');
var steamp_prices = {};
var percent = 100;
var sell = false;
var appid = 730;
var processingItems = false;
window.onload = function () {
	$('.nonresponsive_hidden.responsive_fixonscroll').after('<textarea style="display: block; width: 860px; padding: 10px 20px; margin: 10px; height: 94px; background-color: rgb(58, 58, 58); border-color: rgb(45, 45, 45); color: rgb(143, 152, 160); resize: vertical;" id="sslog" placeholder="SteamSELL logs" readonly=""></textarea>');
	setInterval(function () {
		if (!sell) {
			chrome.storage.local.get(null, function (data) {
				steamp_prices = data.steamp_prices;
				percent = data.percent;
				sell = data.sell;
                appid = data.appid;
			});
		}
		if (sell) {
            clearLog();
			log('Начинаем продажу вещей');
			sell = false;
			chrome.storage.local.set({
				'sell': false
			});
			getInventory(function (err, items) {
				if (err)
					return log('Ошибка получения инвентаря, попробуйте снова');
				sellItems(items);
			});
		}
	}, 1000);
};
function log(text) {
	$('#sslog').val($('#sslog').val() + text + '\n');
    $('#sslog').animate({'scrollTop': $('#sslog').prop('scrollHeight')}, 'slow');
}
function clearLog() {
	$('#sslog').val();
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}
function denormalizeItems(inventory) {
	var id;
	var item;
	var description;
	for (id in inventory.rgInventory) {
		item = inventory.rgInventory[id];
		description = inventory.rgDescriptions[item.classid + '_' + item.instanceid];
		for (var key in description) {
			item[key] = description[key];
		}
	}
	return inventory.rgInventory;
}
function getInventory(callback) {
	$.get($('.profile_small_header_text .whiteLink').last().attr('href') + '/json/' + appid + '/2/', function (data) {
		if (!data && !data.success) {
			return callback(err);
		}
		var items = [];
		if (data.rgInventory.length !== 0) {
			data = denormalizeItems(data);
			for (var i in data) {
				data[i].contextid = '2';
				items.push(data[i]);
			}
		}
		callback(null, items);
	}, 'json');
};
function sellItem(data, callback) {
	window.jQuery.ajax({
		type: 'POST',
		url: 'https://steamcommunity.com/market/sellitem/',
		data: data,
        success: function(data) {
            callback(null, data);
        },
        error: function(){
            return callback(true);
        },
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json'
	});
};
function getItemPrice(name) {
	if (typeof steamp_prices[name] == 'undefined')
		return 0;
	return Math.round(steamp_prices[name].price * percent);
}
function sellItems(items) {
	processingItems = true;
	var itemQueue = async.queue(function (item, next) {
			if (!item.marketable) {
				log('Недоступно для продажи: ' + item.name);
				next();
				return;
			}
			var price = getItemPrice(item.market_hash_name);
			if (price > 0) {
				sellQueue.push({
					item: item,
					price: price
				});
			}
			next();
		}, 2);
	itemQueue.drain = function () {
		if (sellQueue.length() === 0) {
			log('Done');
		}
		processingItems = false;
	};
	items.forEach(function (item) {
		itemQueue.push(item);
	});
}
var sellQueue = async.queue(function (task, next) {
    data = {
        sessionid: readCookie('sessionid'),
        appid: task.item.appid,
        contextid: task.item.contextid,
        assetid: task.item.id,
        amount: 1,
        price: task.price
    };
    sellItem(data, function(err, data) {
        if (!err) {
            log('Выставлено: ' +  task.item.name + ' за ' + task.price/100 + ' (Очередь: ' + sellQueue.length() + ' предметов)');
        } else {
            log('Ошибка продажи: ' + task.item.name);
        }
        next();
    });
}, 1);
sellQueue.drain = function () {
	if (!processingItems) {
		log('Выставление предметов на продажу завершено.');
	}
}
