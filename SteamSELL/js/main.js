var steamp_prices = {};
var discount = 10;
var max_price = 10;
var appid = 730;
var processingItems = false;
var processingOffers = false;
window.onload = function () {
  if ($('.inventory_links').length) {
    $('.inventory_links .inventory_rightnav').prepend(
      '<a id="accept_all" class="btn_darkblue_white_innerfade btn_medium new_trade_offer_btn"><span>Принять обмены</span></a>',
    );
    $('.inventory_links .inventory_rightnav').prepend(
      '<a id="sell_all" class="btn_darkblue_white_innerfade btn_medium new_trade_offer_btn"><span>Продать предметы</span></a>',
    );
    $('.nonresponsive_hidden.responsive_fixonscroll').after(
      '<textarea style="display: none; width: 860px; padding: 10px 20px; margin: 10px; height: 94px; background-color: rgb(58, 58, 58); border-color: rgb(45, 45, 45); color: rgb(143, 152, 160); resize: vertical;" id="sslog" placeholder="SteamSELL logs" readonly=""></textarea>',
    );
    $('#sell_all').click(function () {
      sell_all();
    });
    $('#accept_all').click(function () {
      accept_all();
    });
    $(
      '.inventory_links .inventory_rightnav #inventory_more_dropdown .popup_menu',
    ).append(
      '<a class="popup_menu_item" href="https://steamp.ru/" target="_blank">Наш парсер цен</a><a class="popup_menu_item" href="https://vk.com/skoniks" target="_blank">Написать разработчику</a><a class="popup_menu_item" href="https://steamcommunity.com/tradeoffer/new/?partner=112797909&token=AMFNbblk" target="_blank">Пожертвовать</a>',
    );
    var checkoffers = false,
      checkoffers_time = 0;
    setInterval(function () {
      chrome.storage.local.get(null, function (data) {
        if (data.offers && !checkoffers) {
          checkoffers_time = data.offers;
          checkoffers = setInterval(function () {
            accept_all();
          }, data.offers * 1000);
        } else if (!data.offers && checkoffers) {
          clearInterval(checkoffers);
          checkoffers = false;
        } else if (data.offers && checkoffers_time != data.offers) {
          clearInterval(checkoffers);
          checkoffers_time = data.offers;
          checkoffers = setInterval(function () {
            accept_all();
          }, data.offers * 1000);
        }
      });
    }, 2000);
  }
};
function accept_all() {
  if (processingOffers)
    return log('Принятие уже в процессе, перезагрузите страницу.');
  log('Начинаем принятие обменов');
  var save_href = window.location.href;
  var acceptQueue = async.queue(function (task, next) {
    data = {
      sessionid: readCookie('sessionid'),
      serverid: '1',
      tradeofferid: task.id,
      partner: task.partner,
      captcha: '',
    };
    log(
      'Принимаем обмен #' +
        task.id +
        ' | от: ' +
        task.partner +
        ' | предметов: ' +
        task.items,
    );
    window.history.pushState(
      { link: window.location.origin + '/tradeoffer/' + task.id },
      null,
      window.location.origin + '/tradeoffer/' + task.id,
    );
    acceptOffer(data, function (err, data) {
      if (!err) {
        log(
          'Обмен #' +
            task.id +
            ' принят (Очередь: ' +
            acceptQueue.length() +
            ' обменов)',
        );
      } else {
        log('Ошибка приянтия: ' + task.id);
      }
      next();
    });
  }, 1);
  acceptQueue.drain = function () {
    if (processingOffers) {
      log('Принятие обменов завершено.');
      chrome.storage.local.set({
        status: 'Приняты',
      });
      processingOffers = false;
      window.history.pushState({ link: save_href }, null, save_href);
    }
  };
  $.ajax({
    method: 'GET',
    url: window.location.origin + '/my/tradeoffers/',
    cache: false,
  }).done(function (response, textStatus, jqXHR) {
    if (!$(response).find('.mainLoginPanel').length) {
      var res = response;
      var bodyIdx = [
        res.indexOf('<body class="flat_page responsive_page">'),
        res.indexOf('</body>'),
      ];
      var resHTML = res.substr(bodyIdx[0] + 40, bodyIdx[1] - bodyIdx[0] - 40);
      console.log(resHTML);
      var $body = $(resHTML);
      $('#sslog').slideDown();
      $body.find('.tradeoffer').each(function (i, o) {
        var $tradeoffer = $(this);
        if (!$tradeoffer.find('.link_overlay').length) return;
        var offerID = $tradeoffer.prop('id').substr(13);
        var imgTheirs = $tradeoffer.find(
          '.tradeoffer_items.primary .tradeoffer_item_list .trade_item img',
        );
        var imgYours = $tradeoffer.find(
          '.tradeoffer_items.secondary .tradeoffer_item_list .trade_item img',
        );
        var partner = $tradeoffer
          .find('.btn_grey_grey.btn_medium.ico_hover.btn_report')
          .attr('href')
          .split("'")[1];
        if (imgTheirs.length && !imgYours.length) {
          acceptQueue.push({
            id: offerID,
            partner: partner,
            items: imgTheirs.length,
          });
        }
      });
      processingOffers = true;
      chrome.storage.local.set({
        status: 'Обмены',
      });
      if (!acceptQueue.length()) {
        log('Принятие обменов завершено.');
        chrome.storage.local.set({
          status: 'Приняты',
        });
        processingOffers = false;
      }
    }
  });
}
function acceptOffer(data, callback) {
  window.jQuery.ajax({
    type: 'POST',
    url:
      'https://steamcommunity.com/tradeoffer/' + data.tradeofferid + '/accept',
    data: data,
    success: function (data) {
      callback(null, data);
    },
    error: function () {
      return callback(true);
    },
    crossDomain: true,
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
  });
}
function sell_all() {
  chrome.storage.local.get(null, function (data) {
    if (!data.steamp_prices) return log('Ошибка, список цен не обновлен!');
    steamp_prices = data.steamp_prices;
    if (data.discount) discount = data.discount;
    if (data.max_price) max_price = data.max_price;
  });
  $('#sslog').slideDown();
  log('Начинаем продажу вещей');
  chrome.storage.local.set({
    status: 'Продажа...',
  });
  getInventory(function (err, items) {
    if (err) return log('Ошибка получения инвентаря, попробуйте снова');
    sellItems(items);
  });
}
function log(text) {
  $('#sslog').val($('#sslog').val() + text + '\n');
  $('#sslog').animate({ scrollTop: $('#sslog').prop('scrollHeight') }, 'slow');
}
function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
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
    description =
      inventory.rgDescriptions[item.classid + '_' + item.instanceid];
    for (var key in description) {
      item[key] = description[key];
    }
  }
  return inventory.rgInventory;
}
function getInventory(callback) {
  $.get(
    $('.profile_small_header_text .whiteLink').last().attr('href') +
      '/json/' +
      appid +
      '/2/',
    function (data) {
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
    },
    'json',
  );
}
function sellItem(data, callback) {
  window.jQuery.ajax({
    type: 'POST',
    url: 'https://steamcommunity.com/market/sellitem/',
    data: data,
    success: function (data) {
      callback(null, data);
    },
    error: function () {
      return callback(true);
    },
    crossDomain: true,
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
  });
}
function getItemPrice(name) {
  if (typeof steamp_prices[name] == 'undefined') return 0;
  var price = steamp_prices[name].price * 100;
  return Math.round(price - (price * discount) / 100 - price * 0.13);
}
function sellItems(items) {
  if (processingItems)
    return log('Продажа предметов уже в процессе, перезагрузите страницу.');
  var sellQueue = async.queue(function (task, next) {
    data = {
      sessionid: readCookie('sessionid'),
      appid: task.item.appid,
      contextid: task.item.contextid,
      assetid: task.item.id,
      amount: 1,
      price: task.price,
    };
    sellItem(data, function (err, data) {
      if (!err) {
        log(
          'Выставлено: ' +
            task.item.name +
            ' за ' +
            task.price / 100 +
            ' (Очередь: ' +
            sellQueue.length() +
            ' предметов)',
        );
      } else {
        log('Ошибка продажи: ' + task.item.name);
      }
      next();
    });
  }, 1);
  sellQueue.drain = function () {
    if (processingItems) {
      log('Выставление предметов на продажу завершено.');
      chrome.storage.local.set({
        status: 'Продано',
      });
      processingItems = false;
    }
  };
  items.forEach(function (item) {
    if (!item.marketable) {
      log('Недоступно для продажи: ' + item.name);
      next();
      return;
    }
    var price = getItemPrice(item.market_hash_name);
    if (price > 0 && price < max_price * 100) {
      sellQueue.push({
        item: item,
        price: price,
      });
    }
  });
  processingItems = true;
  if (!sellQueue.length()) {
    log('Выставление предметов на продажу завершено.');
    chrome.storage.local.set({
      status: 'Продано',
    });
    processingItems = false;
  }
}
