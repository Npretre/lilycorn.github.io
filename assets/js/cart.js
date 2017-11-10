function setCookie(cname, cvalue, exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays*24*60*60*1000));
var expires = "expires="+d.toUTCString();

// règle le pb des caractères interdits
if ('btoa' in window) {
cvalue = btoa(cvalue);
}

document.cookie = cname + "=" + cvalue + "; " + expires+';path=/';
}
function saveCart(inCartItemsNum, cartArticles) {
setCookie('inCartItemsNum', inCartItemsNum, 5);
setCookie('cartArticles', JSON.stringify(cartArticles), 5);
}
function getCookie(cname) {
var name = cname + "=";
var ca = document.cookie.split(';');

for(var i = 0; i < ca.length; i++) {
var c = ca[i];
while (c[0] == ' ') {
  c = c.substring(1);
}

if (c.indexOf(name) != -1) {
  if ('btoa' in window) {
    return atob(c.substring(name.length,c.length));
  }
  else {
    return c.substring(name.length,c.length);
  }
}
}
return false;
}
// variables pour stocker le nombre d'articles et leurs noms
var inCartItemsNum;
var cartArticles;

// affiche/cache les éléments du panier selon s'il contient des produits
function cartEmptyToggle() {
if (inCartItemsNum > 0) {
$('#cart-dropdown .hidden').removeClass('hidden');
$('#empty-cart-msg').hide();
}

else {
$('#cart-dropdown .go-to-cart').addClass('hidden');
$('#empty-cart-msg').show();
}
}

// récupère les informations stockées dans les cookies
inCartItemsNum = parseInt(getCookie('inCartItemsNum') ? getCookie('inCartItemsNum') : 0);
cartArticles = getCookie('cartArticles') ? JSON.parse(getCookie('cartArticles')) : [];

cartEmptyToggle();

// affiche le nombre d'article du panier dans le widget
$('#in-cart-items-num').html(inCartItemsNum);

// hydrate le panier
var items = '';
cartArticles.forEach(function(v) {
items += '<li id="'+ v.id +'"><a href="'+ v.url +'">'+ v.name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a></li>';
});

$('#cart-dropdown').prepend(items);

// click bouton ajout panier
$('.add-to-cart').click(function() {

// récupération des infos du produit
var $this = $(this);
var id = $this.attr('data-id');
var name = $this.attr('data-name');
var price = parseInt($this.attr('data-price'));
var ref = $this.attr('data-ref');
var url = $this.attr('data-url');
var qt = parseInt($('#qt').val());
inCartItemsNum += qt;

// mise à jour du nombre de produit dans le widget
$('#in-cart-items-num').html(inCartItemsNum);

var newArticle = true;

// vérifie si l'article est pas déjà dans le panier
cartArticles.forEach(function(v) {
// si l'article est déjà présent, on incrémente la quantité
if (v.id == id) {
  newArticle = false;
  v.qt += qt;
  v.price = v.qt * price;
  $('#'+ id).html(name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a>' + '<br />'+ '<small>' + v.price + ' €' + '</small>' );
}
});
// s'il est nouveau, on l'ajoute
if (newArticle) {
$('#cart-dropdown').prepend('<li id="'+ id +'">'+ name + '<br />' + '<small>' + price + ' €' + '</small>' + '<br><small>Quantité : <span class="qt">'+ qt +'</span></small></a></li>');
cartArticles.push({
  id: id,
  name: name,
  price: price,
  ref: ref,
  qt: qt,
  url: url
});
}
// sauvegarde le panier
saveCart(inCartItemsNum, cartArticles);

// affiche le contenu du panier si c'est le premier article
cartEmptyToggle();
});
