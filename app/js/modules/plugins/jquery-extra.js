define(['jquery'],
function($) {

    var $body = $('body');

    /**
     * Scroll to the selected element
     */
    $.fn.scrollTo = function scrollTo(easing, _cnt) {
        var el = this;
        easing = easing || 'linear';
        var pos = $(el).offset().top;

        $body.animate({
            scrollTop: pos + 'px'
        }, {
            easing: easing,
            complete: function() {
                // don't keep doing this more than four times
                _cnt = (_cnt || 0) + 1;
                if (_cnt > 1) return;

                // get new offset
                var newOffset = $(el).offset().top

                // call this function again if the scroll height isn't right
                if ($body.scrollTop() !== newOffset) {
                    scrollTo.call(el, easing, _cnt);
                }
            }
        });

        return this;
    };
});