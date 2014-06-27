(function(){
  var $ = jQuery;
  
  $.fn.csvEditor = function(csvdata)
  {
    this.html('<textarea>'+csvdata+'</textarea>');
    return this;
  };



})();
