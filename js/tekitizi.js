/* global $ */

function Tekitizi (selector, options) {
  if (options && options.hasOwnProperty('slideshow_id')) {
    this.slideshow_id = options.slideshow_id
  } else {
    this.slideshow_id = 'tekitizi_slideshow'
  }
  this.selector = selector
}

Tekitizi.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    var tekitizi = new Tekitizi(imgSelector, opts)
    tekitizi.init()
  })
}

Tekitizi.prototype.init = function () {
  this.setupWrapper(this.selector)
  this.listenToButtons()
  // ...
}

Tekitizi.prototype.setupWrapper = function (selector) {
  $(selector).each(function (index) {
    var $el = $(this)
    $el.attr('data-src', $el.attr('src'))
    $el.attr('data-id', 'tekitizi-' + (index + 1))
    $el.wrap('<div></div>') // Image
      .parent() // Container
        .addClass('tekitizi-wrapper')
        .css({ // Wrapper takes the same size as the image
          'width': $el.width(),
          'height': $el.height()
        })
        .append('<i class="tekitizi-open-btn fa fa-search" aria-hidden="true"></i>')
  })
}

Tekitizi.prototype.listenToButtons = function () {
  var _this = this

  // Open the slideshow
  $('body').delegate('.tekitizi-open-btn', 'click', function () {
    _this.drawSlideshow(_this.slideshow_id, $(this).prev().attr('data-src'), $(this).prev().attr('data-id'), $(this).prev().attr('alt'))
  })

  // Close the slideshow on close btn
  $('body').delegate('.tekitizi-slideshow-close-btn', 'click', function () {
    _this.actionClose()
  })
  // Close the slideshow on esc
  $(document).keyup(function (e) {
    if (e.keyCode === 27) { _this.actionClose() }
  })

  // Previous image in slideshow on prev btn
  $('body').delegate('.tekitizi-slideshow-prev-btn', 'click', function () {
    _this.actionPrev($('#' + _this.slideshow_id).find('.tekitizi-slideshow-content-image').attr('data-id'))
  })
  // Previous image in slideshow on left arrow on keyboard
  $('body').keyup(function (e) {
    if (e.keyCode === 37) {
      _this.actionPrev($('#' + _this.slideshow_id).find('.tekitizi-slideshow-content-image').attr('data-id'))
    }
  })

  // Previous image in slideshow on next btn
  $('body').delegate('.tekitizi-slideshow-next-btn', 'click', function () {
    _this.actionNext($('#' + _this.slideshow_id).find('.tekitizi-slideshow-content-image').attr('data-id'))
  })
  // Previous image in slideshow on right arrow on keyboard
  $('body').keyup(function (e) {
    if (e.keyCode === 39) {
      _this.actionPrev($('#' + _this.slideshow_id).find('.tekitizi-slideshow-content-image').attr('data-id'))
    }
  })
}

Tekitizi.prototype.drawSlideshow = function (slideshow_id, clicked_img, clicked_id, clicked_alt) {
  // Make the slideshow appear
  $('<div class="tekitizi-slideshow" id=' + slideshow_id + '></div>').appendTo($('body')).hide().fadeIn('slow')

  // Add the slideshow content and the buttons
  var closeSlideshowBtn = '<i class="tekitizi-slideshow-btns tekitizi-slideshow-close-btn fa fa-times" aria-hidden="true"></i>'
  var prevSlideshowBtn = '<i class="tekitizi-slideshow-btns tekitizi-slideshow-control tekitizi-slideshow-prev-btn fa fa-chevron-circle-left" aria-hidden="true"></i>'
  var nextSlideshowBtn = '<i class="tekitizi-slideshow-btns tekitizi-slideshow-control tekitizi-slideshow-next-btn fa fa-chevron-circle-right" aria-hidden="true"></i>'
  var contentSlideshow = '<div class="tekitizi-slideshow-content"></div>'
  $('.tekitizi-slideshow')
    .append(closeSlideshowBtn)
    .append(prevSlideshowBtn)
    .append(nextSlideshowBtn)
    .append(contentSlideshow)

  // Add the clicked image
  var slideshow_image = '<img src="' + clicked_img + '" data-id="' + clicked_id + '" class="tekitizi-slideshow-content-image" alt="' + clicked_alt + '">'
  $(slideshow_image).appendTo($('.tekitizi-slideshow-content')).hide().fadeIn()
}

Tekitizi.prototype.actionNext = function (curr_image_id) {
  var image_list = this.selector
  var curr_position = curr_image_id.split('tekitizi-')[1]

  var next_image_id = ''
  if (parseInt(curr_position, 10) === parseInt($(image_list).length, 10)) {
    next_image_id = 'tekitizi-1'
  } else {
    next_image_id = 'tekitizi-' + (parseInt(curr_position, 10) + 1)
  }

  this.changeImage(next_image_id)
}

Tekitizi.prototype.actionPrev = function (curr_image_id) {
  var image_list = this.selector
  var curr_position = curr_image_id.split('tekitizi-')[1]
  var next_image_id = ''
  if (curr_position === '1') {
    next_image_id = 'tekitizi-' + ($(image_list).length)
  } else {
    next_image_id = 'tekitizi-' + (parseInt(curr_position, 10) - 1)
  }

  this.changeImage(next_image_id)
}

Tekitizi.prototype.changeImage = function (image_id) {
  var changed_image = $('body').find('img[data-id=' + image_id + ']')[0]
  var changed_src = $(changed_image).attr('data-src')
  var changed_alt = $(changed_image).attr('alt')
  var changed_id = $(changed_image).attr('data-id')
  $('.tekitizi-slideshow-content-image').fadeOut(function () {
    $(this).remove()
    var slideshow_image = '<img src="' + changed_src + '" data-id="' + changed_id + '" class="tekitizi-slideshow-content-image" alt="' + changed_alt + '">'
    $(slideshow_image).appendTo('.tekitizi-slideshow-content').hide().fadeIn()
  })
}

Tekitizi.prototype.actionPlay = function () {

}

Tekitizi.prototype.actionPause = function () {

}

Tekitizi.prototype.actionClose = function () {
  $('.tekitizi-slideshow').fadeOut('slow', function () { $(this).remove() })
}
