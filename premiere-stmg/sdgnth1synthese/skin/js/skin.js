// Skin specific Javascript
sc$("content").addEventListener("scroll", function (pEvt) {
	const vCurrentScrollPos = this.scrollTop;
	if (sc$("content").fPrevScrollpos < vCurrentScrollPos) document.body.classList.add("scrollingDown");
	else document.body.classList.remove("scrollingDown");
	sc$("content").fPrevScrollpos = vCurrentScrollPos;
});