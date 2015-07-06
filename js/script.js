/* Author: those jerks

*/


(function(global, doc, $, undefined){

  var URN;
  if (!URN) {
    URN = {};
  }

  URN.theShadowing = (function(options) {

  /* define */

        // properties
    var depth,
        color,
        direction = {
          "northwest" : { x : -1, y : -1 },
          "northeast" : { x : 1, y : -1 },
          "southeast" : { x : 1, y : 1 },
          "southwest" : { x : -1, y : 1 }
        },
        x,
        y,
        textShadow,
        fontFamily,
        fontSize,
        sampleText,
        eventSwitch = $(doc),

        // elements
        forms = $('#shadow-form, #preview-form'),
        depth_elem = $('#depth'),
        color_elem = $('#color'),
        direction_elem = $('#direction'),
        fontFamily_elem = $('#font-family'),
        fontSize_elem = $('#font-size'),
        fontSize_indicator = $('#font-size-indicator'),
        sampleText_elem = $('#font-text'),
        boldInput_elem = $('#bold'),

        // functions
        init,
        renderProperty,
        updatePreview,
        updateCode,
        debug;

  /* methods */

    init = function init () {
      // Get initial values
      depth = depth_elem.val();
      color = color_elem.val();
      x = direction[ direction_elem.val() ].x;
      y = direction[ direction_elem.val() ].y;
      fontFamily = fontFamily_elem.val();
      fontWeight = (boldInput_elem.is(":checked")) ? "bold" : "normal";

      /* events */
      forms.on("submit", function (e) {
        e.preventDefault();
      });

      depth_elem.on("change", function (e) {
         console.log('change');
         depth = depth_elem.val();
         renderProperty();
      });

      color_elem.on("input", function (e) {
        color = color_elem.val();
        renderProperty();
      });

      direction_elem.on("change", function (e) {
        var corner = direction[$(this).val()];
        x = corner.x;
        y = corner.y;
        renderProperty();
      });

      fontFamily_elem.on("change", function (e) {
        fontFamily = fontFamily_elem.val();
        eventSwitch.trigger("updatePreview.text-shadow");
      });

      fontSize_elem.on("change", function (e) {
        fontSize = fontSize_elem.val();
        fontSize_indicator.val(fontSize);
        eventSwitch.trigger("updatePreview.text-shadow");
      });

      sampleText_elem.on("blur", function (e) {
        sampleText = sampleText_elem.val();
        eventSwitch.trigger("updatePreview.text-shadow");
      });

      boldInput_elem.on("click", function (e) {
        fontWeight = (boldInput_elem.is(":checked")) ? "bold" : "normal";
        eventSwitch.trigger("updatePreview.text-shadow");
      });

      /* dumb pub/sub */
      // update both
      eventSwitch.on("update.text-shadow", updatePreview);
      eventSwitch.on("update.text-shadow", updateCode);
      // update one
      eventSwitch.on("updatePreview.text-shadow", updatePreview);
      eventSwitch.on("updateCode.text-shadow", updateCode);

      // gonna have to figure this out later.
      x = -1;
      y = 1;
    };

    renderProperty = function renderProperty () {
      // reset text shadow
      textShadow = "";

      for(var i = 1; i <= depth; i += 1) {
        textShadow += (x * i) + "px " + (y * i) + "px " + color;
        // need to coerce depth to be a number not a string, hence the ~~
        if ( i !== ~~ depth ) textShadow += ", ";
      }

      // fire update event
      eventSwitch.trigger("update.text-shadow");
    };

    updatePreview = function updatePreview () {
      $("#preview").css({
        "textShadow" : textShadow,
        "fontFamily" : fontFamily,
        "fontSize" : fontSize + "px",
        "fontWeight" : fontWeight
      });

      $("#preview").text(sampleText);
    };

    updateCode = function updateCode () {
      $("#output").html("text-shadow : " + textShadow);
    };

    debug = function debug () {
      console.debug({
         "depth" : depth,
         "color" : color,
         "text-shadow" : textShadow,
         "font-family" : fontFamily,
         "font-size" : fontSize,
         "sample text" : sampleText
      });
    };

    /* public */
    return {
      init : init,
      debug : debug
    };
  })({});

  /* DOM Ready */
  $(function onReady () {
    URN.theShadowing.init();
  });

  // make it globally accessible
  global.URN = URN;

})(this, this.document, this.jQuery);

