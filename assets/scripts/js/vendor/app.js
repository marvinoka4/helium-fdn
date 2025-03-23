$(document).foundation()

//Hamburger classes
jQuery(document).on( "opened.zf.offCanvas", function() {
jQuery(".hamburger").addClass("is-active");
})
jQuery(document).on( "closed.zf.offCanvas", function() {
jQuery(".hamburger").removeClass("is-active");
})