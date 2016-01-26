(function (nx, global) {

  var document = global.document;
  var ReadyService = nx.declare({
    properties: {
      topFrame: false,
      hasReady: false
    },
    statics: {
      init: function () {
        this.queue = [];
      },
      addQueue: function (inHandler) {
        this.queue.push(inHandler);
      },
      clearQueue: function () {
        this.queue.length = 0;
      },
      execQueue: function () {
        var i = 0,
          length = this.queue.length;
        for (; i < length; i++) {
          this.queue[i]();
        }
      }
    }
  });


  var ReadyController = nx.declare({
    statics: {
      initReady: function (inHandler) {
        ReadyService.addQueue(inHandler);//save the event
        return this.isReady();
      },
      fireReady: function () {
        ReadyService.execQueue();
        ReadyService.clearQueue();
      },
      setTopFrame: function () {
        // If IE and not a frame
        // continually check to see if the document is ready
        try {
          ReadyService.topFrame(global.frameElement === null && document.documentElement);
        } catch (e) {
        }
      },
      doScrollCheck: function () {
        var topFrame = ReadyService.topFrame();
        if (topFrame && topFrame.doScroll) {
          try {
            // Use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            topFrame.doScroll("left");
          } catch (e) {
            return setTimeout(ReadyController.doScrollCheck, 50);
          }

          // and execute any waiting functions
          ReadyController.fireReady();
        }
      },
      isOnLoad: function (inEvent) {
        return (inEvent || global.event).type === 'load';
      },
      isReady: function () {
        return ReadyService.hasReady() || document.readyState === "complete";
      },
      detach: function () {
        if (document.addEventListener) {
          document.removeEventListener("DOMContentLoaded", ReadyController.completed, false);
          global.removeEventListener("load", ReadyController.completed, false);
        } else {
          document.detachEvent("onreadystatechange", ReadyController.completed);
          global.detachEvent("onload", ReadyController.completed);
        }
      },
      contentLoaded: function () {
        document.addEventListener('DOMContentLoaded', ReadyController.completed, false);
        global.addEventListener('load', ReadyController.completed, false);
      },
      windowOnload: function () {
        document.attachEvent("onreadystatechange", ReadyController.completed);
        global.attachEvent("onload", ReadyController.completed);
        ReadyController.setTopFrame();
        ReadyController.doScrollCheck();
      },
      readyMain: function () {
        if (document.readyState === "complete") {
          return setTimeout(ReadyController.readyMain);
        } else {
          if (document.addEventListener) {
            //w3c
            ReadyController.contentLoaded();
          } else {
            //old ie
            ReadyController.windowOnload();
          }
        }
      },
      completed: function (inEvent) {
        if (ReadyController.isReady() || ReadyController.isOnLoad(inEvent)) {
          ReadyService.hasReady(true);
          ReadyController.detach();
          ReadyController.fireReady();
        }
      }
    }
  });

  nx.ready = function (inHandler) {
    //add handler to queue:
    if (ReadyController.initReady(inHandler)) {
      setTimeout(ReadyController.fireReady, 1);
    } else {
      ReadyController.readyMain();
    }
  };

}(nx, nx.GLOBAL));
