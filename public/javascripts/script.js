$( document ).ready(function() {
  setActive();
});

function setActive() {
  $('.ui.secondary.pointing.menu a').on( 'mouseenter', function() {
    $(this).closest('a').addClass('active item');
  });
  $('.ui.secondary.pointing.menu a').on( 'mouseleave', function() {
    $(this).closest('a').removeClass('active');
  });
}
