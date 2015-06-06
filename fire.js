var firebase = require('firebase');
var fb = new firebase('https://politica.firebaseio.com/');

module.exports = function(word, callback) {
  fb.once('value', function(snapshot) {
      var data = snapshot.val();
      data.forEach(function(dataSnap) {
          var index = word.indexOf(' ');
          var first = dataSnap.Name.substring(0, index);
          var last = word.substring(index + 1);
          var candidate = dataSnap.Name;
          if (candidate.indexOf(first) >= 0 && candidate.indexOf(last) >= 0)
            callback(dataSnap.CID);
      });
  });
}