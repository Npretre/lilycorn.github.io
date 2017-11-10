var name = $('.name').val();
var ref = $('.ref').val();

$('#addButton').click(function(){
  var table = name, ref;
  var arr = jQuery.makeArray( table );

  $(arr).appendTo(document.body);
})
