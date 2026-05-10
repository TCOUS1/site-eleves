"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
postscriptum.plugin('cp-slideshow', (processor, options) => {
	const { util } = postscriptum;
	const { ranges } = util;
	let resizeTimeout, currentPageIndex = -1;
	let previousSize = [window.innerWidth, window.innerHeight];
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const size = [window.innerWidth, window.innerHeight];
			console.log(size[0] - previousSize[0], size[1] - previousSize[1]);
			if (size[0] < previousSize[0] || size[0] - previousSize[0] > 150 || size[1] < previousSize[1] || size[1] - previousSize[1] > 150) {
				sessionStorage.setItem("sldReloadPageIndex", currentPageIndex.toString());
				previousSize = size;
				window.location.reload();
			}
		}, 200);
	});
	let doc = processor.source.ownerDocument;
	let sldScroll = false;
	processor.on('contents-start', function () {
		if (this.currentPage.body.querySelector('div.exercice:not(.openQuestion)')) {
			sldScroll = true;
		}
	});
	processor.on('no-break-point', function () {
		if (this.layoutContext.parentCtx)
			return;
		let fontSize = parseFloat(getComputedStyle(this.currentPage.body).fontSize);
		if (fontSize == 8)
			sldScroll = true;
		if (sldScroll) {
			const ctx = this.layoutContext;
			ctx.breakPoint = ranges.positionAfter(this.currentPage.body.lastChild);
			ctx.breakedBox = null;
			return 'break-point-found';
		}
		else {
			fontSize = Math.floor(fontSize * 80) / 100;
			if (fontSize < options.minFontSize)
				fontSize = options.minFontSize;
			this.currentPage.body.style.fontSize = fontSize + 'px';
			console.log(`[cp-slideshow] Font reduced to ${fontSize} on page ${this.currentPage.number}`);
			return 'detect-overflow';
		}
	});
	processor.on('page-end', function () {
		if (sldScroll)
			this.currentPage.body.classList.add('sldScroll');
		sldScroll = false;
	});
	let pages;
	processor.on('end', function () {
		pages = this.dest.getElementsByTagName('ps-page');
		window.addEventListener('hashchange', hashchange);
		let sldReloadPageIndex = sessionStorage.getItem("sldReloadPageIndex");
		if (sldReloadPageIndex !== null)
			gotoPage(parseInt(sldReloadPageIndex));
		else
			hashchange();
		sessionStorage.removeItem("sldReloadPageIndex");
		doc.addEventListener('keydown', event => {
			if ("scImgMgr" in window && scImgMgr.fCurrItem)
				return;
			if (event.keyCode == 37 /* LEFT ARROW */)
				previousPage();
			else if (event.keyCode == 39 /* RIGHT ARROW */)
				nextPage();
		});
		let touchStart;
		document.addEventListener('touchstart', function (event) {
			touchStart = event.changedTouches[0];
			touchStart.time = Date.now();
		}, false);
		document.addEventListener('touchend', function (event) {
			const touchEnd = event.changedTouches[0], distanceX = touchEnd.pageX - touchStart.pageX, distanceY = touchEnd.pageY - touchStart.pageY, elapsedTime = Date.now() - touchStart.time;
			if (Math.abs(distanceX) >= 150 && elapsedTime <= 500 && Math.abs(distanceY) <= 100) {
				// Swipe
				if (distanceX > 0)
					previousPage();
				else
					nextPage();
			}
		}, false);
	});
	function hashchange() {
		let hash = window.location.hash;
		if (!hash)
			gotoPage(0);
		let target = document.getElementById(hash.substr(1));
		if (!target)
			gotoPage(0);
		else
			gotoElement(target);
	}
	function nextPage() {
		gotoPage(currentPageIndex + 1);
	}
	function previousPage() {
		gotoPage(currentPageIndex - 1);
	}
	function gotoElement(element) {
		let parent = element;
		while (parent.nodeType == Node.ELEMENT_NODE) {
			if (parent.localName == 'ps-page') {
				gotoPage(Array.prototype.indexOf.call(pages, parent));
				break;
			}
			parent = parent.parentNode;
		}
	}
	function gotoPage(pageIndex) {
		if (pageIndex < 0)
			pageIndex = 0;
		else if (pageIndex >= pages.length)
			pageIndex = pages.length - 1;
		if (currentPageIndex != -1)
			pages[currentPageIndex].removeAttribute('ps-slideshow-current');
		let currentPage = pages[pageIndex];
		currentPage.setAttribute('ps-slideshow-current', 'true');
		currentPageIndex = pageIndex;
		for (let i = 0; i < tplMgr.fPageOutlineTargets.length; i++) {
			let target = tplMgr.fPageOutlineTargets[i];
			if (currentPage.contains(target)) {
				tplMgr.updatePageOutline(target);
			}
		}
	}
}, { minFontSize: 8 });
