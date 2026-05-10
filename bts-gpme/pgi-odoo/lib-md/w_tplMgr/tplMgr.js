/* === CANOPROF page manager ================================================ */
window.tplMgr = {
	fHeaderPath : "ide:header",
	fMenuPath : "ide:outline",
	fPageOutlinePath : "ide:outline/des:ul.pageOutline",
	fContentPath : "ide:content",
	fInfoPath : "des:aside.info",
	fExternalIframePath : "des:iframe.externalUrl",
	fPdfIframePath : "des:iframe.pdfFrame",
	fCbkPath : "des:.collapsed",
	fGapPath : "des:input.gapInput|input.exoInput",
	fLnkHistPath : "des:a.lnkActivity|a.lnkTool",
	fStudentAreaPath : "des:div.studentArea/chi:textarea",
	fMatchBasketPath : "des:td.mtTdBasket",
	fLogin : null,
	fUrlOutline : null,
	fCbkInit : true,
	fPageOutlineAnchors : [],
	fPageOutlineTargets : [],
	fInfoOpen : true,
	fMenuOpen : false,
	fScrollTicking : false,
	fScrollPos : 0,
	fWheelScrollFactor : 10,
	fHoverScrollSpeed : 2,
	fClickScrollJump : 20,
	fIsIOS : /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()),
	fIsAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
	fListeners : {scrollPage:[],slideMode:[]},
	fDysOptions : {
		pathRoot: "bod:/chi:div.root",
		pathContent: "ide:content",
		pathBtnParent: "ide:header",
		pathPanelParent: "bod:/chi:div.root",
		defaultPanelInactive: true,
		ignoreFilter: ".dysPanel|.hidden|.footnotes|.colBlockTgleBtn|.CodeMirror-static|script|noscript|object|.tooltip_ref|.toolbar|.txt_mathtex_tl|.MathJax_Preview|.MathJax_SVG_Display"
	},
		fStrings : ["Ouvrir le menu","Fermer le menu",
		/*02*/    "Afficher les informations","Cacher les informations",
		/*04*/    "défilement haut","Faire défiler le menu vers le haut",
		/*06*/    "défilement bas","Faire défiler le menu vers le bas",
		/*08*/    "Tout afficher","Afficher toutes les sections qui sont refermées",
		/*10*/    "Tout réduire","Réduire toutes les sections qui sont ouvertes",
		/*12*/    "Retour","Revenir à \'%s\'",
		/*14*/    "Diaporama","Active la consultation du contenu en mode diaporama",
		/*16*/    'Ouvrir le contenu distant \"%s\" dans une nouvelle fenêtre.',"Un contenu non sécurisé (http) ne peut être embarqué dans une page sécurisée (https).",
		/*18*/    "Votre navigateur ne permet pas de visualiser des PDF directement dans une page web. Pour le visualiser : ","cliquez ici",
		/*20*/    "Afficher","Cacher",
		/*22*/    "Ouvrir","Fermer",
		""],

	controlLogin : function(pLogin){
		const vSavedCode = sessionStorage.getItem("code");
		if (pLogin.code !== vSavedCode) {
			sessionStorage.setItem("page", window.location);
			const vUrl = pLogin.url;
			setTimeout(function(){window.location=vUrl}, 1); //https://crbug.com/977520
		}
	},
	init : function(){
		const vCbks = scPaLib.findNodes(this.fCbkPath);
		let vBackButton;
		let i;
		try{
			this.fPageCurrent = scServices.scLoad.getUrlFromRoot(scCoLib.hrefBase());
			this.fStore = new LocalStore();
			let vHash = window.location.hash;
			if (vHash.length>0) vHash = vHash.substring(1);
			this.fContent = scPaLib.findNode(this.fContentPath);
			this.fContent.style.position = "relative";
			this.fContent.addEventListener("scroll", function(pEvt){
				tplMgr.fScrollPos = pEvt.target.scrollTop;
				if (!tplMgr.fScrollTicking){
					window.requestAnimationFrame(function() {
						tplMgr.fireEvent("scrollPage");
						tplMgr.fScrollTicking = false;
					});
				}
				tplMgr.fScrollTicking = true;
			});

			// Close collapsable blocks that are closed by default.
			scDynUiMgr.collBlk.fMode = 1;
			if (this.fCbkInit){
				for (i = 0; i<vCbks.length; i++) {
					const vCbk = vCbks[i];
					const vTgl = vCbk.fTgl = scPaLib.findNode("des:a", vCbk);
					if (!vHash || (!this.xIsContainedBy(sc$(vHash), vCbk) && !this.xIsContainedBy(vCbk, sc$(vHash)))) {
						vTgl.onclick();
					} else {
						const vCo = scPaLib.findNode("chi:div", vCbk);
						vCo.fClassName = vCo.className;
						vCo.fTitle = vTgl;
						vCo.className = vCo.fClassName + " " + scDynUiMgr.collBlk.fClassPrefix + "open";
						vCo.fCollapsed = false;
					}
				}
			}

			// Init activity history
			if (scPaLib.findNode("bod:.default")){
				try {
					this.fLinkHistory = JSON.parse(sessionStorage.getItem("linkHistory"));
					if (!this.fLinkHistory) this.fLinkHistory = [];
				} catch(e){
					this.fLinkHistory = [];
				}
				const vLnkHists = scPaLib.findNodes(this.fLnkHistPath);
				for (i = 0; i<vLnkHists.length; i++) {
					const vLnkHist = vLnkHists[i];
					vLnkHist.onclick = function(){
						const vId = this.id || this.parentNode.id;
						tplMgr.setHistory(vId ? scCoLib.hrefBase() + "#" + vId : scCoLib.hrefBase());
					}
				}
				this.resetHistory(scCoLib.hrefBase());
				if (this.fLinkHistory.length>0){
					vBackButton = scDynUiMgr.addElement("button", scPaLib.findNode(this.fHeaderPath), "backBtn");
					vBackButton.onclick = function(){window.location.assign(tplMgr.fLinkHistory[0].href)};
					vBackButton.innerHTML = '<span>'+this.fStrings[12]+'</span>';
					vBackButton.title = this.fStrings[13].replace("%s", this.fLinkHistory[0].title);
					this.xSwitchClass(document.body, "noBack", "hasBack", true);
				} else if (sessionStorage.getItem('SCportal-parent-url')){
					vBackButton = scDynUiMgr.addElement("button", scPaLib.findNode(this.fHeaderPath), "backBtn");
					vBackButton.onclick = function(){window.location.assign(sessionStorage.getItem('SCportal-parent-url'))};
					vBackButton.innerHTML = '<span>'+this.fStrings[12]+'</span>';
					vBackButton.title = this.fStrings[13].replace("%s", sessionStorage.getItem('SCportal-parent-title'));
					this.xSwitchClass(document.body, "noBack", "hasBack", true);
				} else this.xSwitchClass(document.body, "hasBack", "noBack", true);
			} else this.xSwitchClass(document.body, "hasBack", "noBack", true);

			// Init Info
			if (scPaLib.findNode(this.fInfoPath)){
				this.fToggleInfoButton = scDynUiMgr.addElement("button", scPaLib.findNode(this.fHeaderPath), "infoBtn");
				this.fToggleInfoButton.onclick = function(){tplMgr.toggleInfo()};
				if (vHash !== "displayinfo") this.toggleInfo();
				else this.xSwitchClass(document.body, "hideInfo", "showInfo", true);
			} else {
				this.xSwitchClass(document.body, "showInfo", "hideInfo", true);
			}
			
			// Init menu
			if (scPaLib.findNode(this.fMenuPath)){
				const vMenu = this.fMenu = scPaLib.findNode(this.fMenuPath + "/chi:ul.outline|.pageOutline");
				const vMenuToolbar = scDynUiMgr.addElement("div", scPaLib.findNode(this.fMenuPath), "menuToolbar", vMenu);
				if (vMenu){
					vMenu.className = vMenu.className + " outlineRoot"
					this.xSwitchClass(document.body, "noMenu", "hasMenu", true);
					const vWaiMenuBtn = scPaLib.findNode("ide:accessibility/des:.waiMenu/des:a");
					if (vWaiMenuBtn) vWaiMenuBtn.onclick = function(){tplMgr.toggleMenu(true)};
					if (vCbks.length>0){
						this.xAddBtn(vMenuToolbar, "cbkOpenBtn", this.fStrings[8], this.fStrings[9]).onclick = function() {tplMgr.openCbks()};
						this.xAddBtn(vMenuToolbar, "cbkCloseBtn", this.fStrings[10], this.fStrings[11]).onclick = function() {tplMgr.closeCbks()};
					}
					if ("ScSiRuleEnsureVisible" in window) this.fMenuRule = new ScSiRuleEnsureVisible("ide:outline/des:.outlineSelect_yes|.currentSection_yes", "anc:ul.outlineRoot");
					vMenu.style.overflow="hidden";
					const vSrlUp = this.fSrlUp = scDynUiMgr.addElement("div", vMenu.parentNode, "mnuSrlUpFra", vMenu);
					vSrlUp.ontouchstart = function(){
						this.fIsTouched = true;
					};
					vSrlUp.onclick = function(){
						this.fIsTouched = false;
					};
					vSrlUp.onmouseover = function(){
						if (this.fIsTouched) return;
						if(tplMgr.scrollTask.fSpeed >= 0) {
							tplMgr.scrollTask.fSpeed = -tplMgr.fHoverScrollSpeed;
							scTiLib.addTaskNow(tplMgr.scrollTask);
						}
					};
					vSrlUp.onmouseout = function(){
						if (this.fIsTouched) return;
						tplMgr.scrollTask.fSpeed = 0;
					};
					const vSrlUpBtn = this.xAddBtn(vSrlUp, "mnuSrlUpBtn", this.fStrings[4], this.fStrings[5]);
					vSrlUpBtn.setAttribute("aria-hiden", "true");
					vSrlUpBtn.onclick = function(){
						tplMgr.scrollTask.step(-tplMgr.fClickScrollJump);
						return false;
					};
					const vSrlDwn = this.fSrlDwn = scDynUiMgr.addElement("div", vMenu.parentNode, "mnuSrlDwnFra", vMenu);
					vSrlDwn.ontouchstart = function(){
						this.fIsTouched = true;
					};
					vSrlDwn.onclick = function(){
						this.fIsTouched = false;
					};
					vSrlDwn.onmouseover = function(){
						if (this.fIsTouched) return;
						if(tplMgr.scrollTask.fSpeed <= 0) {
							tplMgr.scrollTask.fSpeed = tplMgr.fHoverScrollSpeed;
							scTiLib.addTaskNow(tplMgr.scrollTask);
						}
					};
					vSrlDwn.onmouseout = function(){
						if (this.fIsTouched) return;
						tplMgr.scrollTask.fSpeed = 0;
					};
					const vSrlDwnBtn = this.xAddBtn(vSrlDwn, "mnuSrlDwnBtn", this.fStrings[6], this.fStrings[7]);
					vSrlDwnBtn.setAttribute("aria-hiden", "true");
					vSrlDwnBtn.onclick = function(){
						tplMgr.scrollTask.step(tplMgr.fClickScrollJump);
						return false;
					};
					this.scrollTask.checkBtn();
					scSiLib.addRule(vMenu, this.scrollTask);
					vMenu.onscroll = function(){tplMgr.scrollTask.checkBtn()};
					vMenu.onmousewheel = function(){tplMgr.scrollTask.step(Math.round(-event.wheelDelta/(scCoLib.isIE ? 60 : 40)*tplMgr.fWheelScrollFactor))}; //IE, Safari, Chrome, Opera.
					if(vMenu.addEventListener) vMenu.addEventListener('DOMMouseScroll', function(pEvent){tplMgr.scrollTask.step(pEvent.detail*tplMgr.fWheelScrollFactor)}, false);
				}
				if (scPaLib.findNode("bod:.textActivity") && "postscriptumMgr" in window && postscriptumMgr.available()) {
					this.fSldModeBtn = this.xAddBtn(vMenuToolbar, "sldModeBtn", this.fStrings[14], this.fStrings[15]).onclick = function() {
						tplMgr.toggleSldMode()
					}
				}
				if (vMenu || vMenuToolbar.hasChildNodes()){
					this.fToggleMenuButton = scDynUiMgr.addElement("button", scPaLib.findNode(this.fHeaderPath), "menuBtn");
					this.fToggleMenuButton.onclick = function(){tplMgr.toggleMenu()};
					const vSavedToggleMenu = localStorage.getItem("toggleMenu");
					if (vMenu){
						this.fMenuOpen = vSavedToggleMenu==="false" ? true : (vSavedToggleMenu==="true" ? false : (!scPaLib.checkNode(".outline", vMenu)));
					} else {
						this.fMenuOpen = true;
						this.xSwitchClass(document.body, "noMenu", "floatMenu", true);
					}
					this.toggleMenu();
				} else {
					this.xSwitchClass(document.body, "showMenu", "hideMenu", true);
				}
			}

			// Init page outline
			const vPageOutline = scPaLib.findNode(this.fPageOutlinePath);
			if (vPageOutline){
				this.fPageOutlineAnchors = scPaLib.findNodes("des:a", vPageOutline);
				for (i = 0; i<this.fPageOutlineAnchors.length; i++) {
					const vPageOutlineAnchor = this.fPageOutlineAnchors[i];
					const vTarget = sc$(vPageOutlineAnchor.hash.substring(1));
					vTarget.fAnchor = vPageOutlineAnchor;
					this.fPageOutlineTargets.push(vTarget);
				}
				this.registerListener("scrollPage", function(){tplMgr.updatePageOutline();});
				this.updatePageOutline();
			}

			// HASH listener
			window.addEventListener("hashchange", function(){
				let vHash = window.location.hash;
				if (vHash.length>0) vHash = vHash.substring(1);
				if (vHash==="displayinfo") return;
				//scCoLib.log("tplMgr.hashchange : "+vHash);
				const vAnchor = sc$(vHash);
				if (vAnchor){
					const vAncCbks = scPaLib.findNodes("anc:.collBlk_closed", vAnchor);
					for (let i=0; i< vAncCbks.length; i++){
						vAncCbks[i].fTitle.onclick();
					}
					const vCurrBk = scPaLib.findNode("nsi:.collBlk_closed", vAnchor);
					if (vCurrBk) vCurrBk.fTitle.onclick();
					if (vAncCbks.length>0) window.location = window.location;
				}
				tplMgr.updatePageOutline(vAnchor);
			}, false);

			// Init StudentAreas
			const vStudentAreas = scPaLib.findNodes(this.fStudentAreaPath);
			for (i = 0; i<vStudentAreas.length; i++) {
				const vStudentArea = vStudentAreas[i];
				if (scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()){
					vStudentArea.value = tscServices.suspendDataStorage.getVal(["StudentArea", vStudentArea.id]);
				} else vStudentArea.value = localStorage.getItem(vStudentArea.id);
				vStudentArea.addEventListener("blur", function(){
					if (scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()){
						scServices.suspendDataStorage.setVal(["StudentArea", this.id], this.value);
					} else localStorage.setItem(this.id, this.value);
				}, false);
			}

			// Init pdfFrames
			if (this.fIsAndroid || this.fIsIOS){
				const vPdfIframes = scPaLib.findNodes(this.fPdfIframePath);
				for (i = 0; i<vPdfIframes.length; i++) {
					const vPdfIframe = vPdfIframes[i];
					const vIframeParent = vPdfIframe.parentNode;
					scDynUiMgr.addElement("em", vIframeParent, "pdfFallBack").innerHTML = this.fStrings[18];
					const vPdfLink = scDynUiMgr.addElement("a", vIframeParent, "pdfLink");
					vPdfLink.target="_blank";
					vPdfLink.href=vPdfIframe.src;
					vPdfLink.innerHTML = this.fStrings[19];
					vIframeParent.removeChild(vPdfIframe);
				}
			}
			
			// Init fMatchBasketPath
			this.MatchBaskets = scPaLib.findNodes(this.fMatchBasketPath);
			if (this.MatchBaskets.length>0){
				this.registerListener("scrollPage", function(){tplMgr.updateMatchBaskets();});
				scSiLib.addRule(this.fContent, {
					onResizedAnc : function(pOwnerNode, pEvent) {
						if(pEvent.phase===1 || pEvent.resizedNode === pOwnerNode) return;
						tplMgr.updateMatchBaskets();
					},
					onResizedDes : function(pOwnerNode, pEvent) {
						if(pEvent.phase===1) return;
						tplMgr.updateMatchBaskets();
					}
				});
				for (i = 0; i<this.MatchBaskets.length; i++) {
					const vMatchBasket = this.MatchBaskets[i];
					vMatchBasket.fContainer = scPaLib.findNode("chi:div", vMatchBasket);
					vMatchBasket.fContainer.style.marginTop = "0px";
					vMatchBasket.fContainer.style.marginBottom = "0px";
				}
			}

			if ("scTooltipMgr" in window ) {
				scTooltipMgr.addShowListener(this.sTtShow);
				scTooltipMgr.addHideListener(this.sTtHide);
			}

			if (scPaLib.findNode("bod:.textActivity") && "postscriptumMgr" in window && postscriptumMgr.available()) {
				if (sessionStorage.getItem("sldMode") === "true") tplMgr.toggleSldMode();
			}
			
			// Dys
			if(scPaLib.checkNode(".dysToolbar", document.body)){
				window.dysOptions = this.fDysOptions;
				const vScript = document.createElement('script');
				vScript.setAttribute("src", scServices.scLoad.resolveDestUri("/lib-md/w_tplMgr/dys/dys.js"))
				document.getElementsByTagName("head")[0].appendChild(vScript);
				const vCss = document.createElement("link");
				vCss.setAttribute("rel", "stylesheet")
				vCss.setAttribute("type", "text/css")
				vCss.setAttribute("href", scServices.scLoad.resolveDestUri("/lib-md/w_tplMgr/dys/dys.css"));
				document.getElementsByTagName("head")[0].appendChild(vCss);
			}
			scOnLoads[scOnLoads.length] = this;
		} catch(e){scCoLib.log("ERROR tplMgr.init : "+e)}
	},

	loadSortKey:"ZZ",

	onLoad : function(){
		let i;
// Init text input resizing
		const vGaps = scPaLib.findNodes(this.fGapPath);
		for (i = 0; i<vGaps.length; i++) {
			const vGap = vGaps[i];
			vGap.fSizeSpan = scDynUiMgr.addElement("span", vGap.parentNode, "gapSize", null, {visibility:"hidden", position:"absolute", left:"-10000px", top:"-10000px"});
			vGap.fWidth = 10 * Math.min(Math.max(2, vGap.getAttribute("size")), vGap.className.indexOf("proportional")>=0 ? 30 : (vGap.className.indexOf("exoInput") >=0 ? 20 : 15));
			function resizeForText(vText, vGap) {
				vGap.fSizeSpan.textContent = vText;
				vGap.style.width = Math.max(vGap.fSizeSpan.clientWidth, vGap.fWidth) + "px";
			}
			vGap.addEventListener("keypress", function(pEvt){
				pEvt = pEvt || window.event;
				if (pEvt.which && pEvt.charCode) {
					const c = String.fromCharCode(pEvt.keyCode | pEvt.charCode);
					resizeForText(this.value + c, this);
				}
			}, false);
			vGap.addEventListener("keyup", function(pEvt){
				pEvt = pEvt || window.event;
				if (pEvt.keyCode === 8 || pEvt.keyCode === 46 || pEvt.keyCode === 17) { //backspace, delete, ctrl
					resizeForText(this.value, this);
				}
			}, false);
			resizeForText(vGap.value, vGap);
		}
		// Init external iframes
		if (window.location.protocol === "https:"){
			const vFrames = scPaLib.findNodes(this.fExternalIframePath);
			for (i = 0; i<vFrames.length; i++) {
				const vFrame = vFrames[i];
				const vSrc = vFrame.getAttribute("src");
				if (vSrc.indexOf("http:")===0) vFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent('<html style="font-family:sans-serif;height:100%;" lang="note=Langue%20par%20d%C3%A9faut%20des%20pages%20(fr%2C%20en%2C%20es%2C%20ar);fr"><head><title/></head><body style="position:absolute;top:0;left:0;right:0;bottom:0;box-shadow:inset 0 0 50px #e39595;margin:0;"><p style="position:absolute;top:30%;left:10%;right:10%;text-align:center;color:gray;"><em>'+this.fStrings[16].replace('%s', '<a target="_blank" href="'+vSrc+'">'+vSrc+'<a>')+'<br/><br/>'+this.fStrings[17]+'</em></p></body></html>');
			}
		}
	},
	openCbks : function(){
		const vCbks = scPaLib.findNodes("des:.collBlk_closed");
		for (let i=0; i<vCbks.length; i++) vCbks[i].fTitle.onclick();
	},
	closeCbks : function(){
		const vCbks = scPaLib.findNodes("des:.collBlk_open");
		for (let i=0; i<vCbks.length; i++) vCbks[i].fTitle.onclick();
	},
	updateMatchBaskets : function(){
		//scCoLib.log("updateMatchBaskets");
		for (let i=0; i<this.MatchBaskets.length; i++) {
			const vBasket = this.MatchBaskets[i];
			const vBasketOffset = this.xGetOffsetTop(vBasket, this.fContent);
			if (isNaN(vBasketOffset)) break;
			const vScrollTop = this.fContent.scrollTop;
			const vBasketHeight = vBasket.clientHeight;
			if (vBasketOffset+vBasketHeight>vScrollTop && vBasketOffset<vScrollTop){ // Basket is visible
				vBasket.fContainer.style.marginTop=Math.min(vScrollTop-vBasketOffset, vBasketHeight-vBasket.fContainer.clientHeight)+"px";
			} else vBasket.fContainer.style.marginTop="0px";
		}
	},
	updatePageOutline : function(pTarget){
		let i;
		let vTarget = null, vTargetOffset = null, vTargetHeight = null;
		if (this.fPageOutlineTargets.length===0) return;
		if (pTarget && pTarget.fAnchor) vTarget = pTarget;
		else{
			const vContentHeight = this.fContent.clientHeight;
			for (i = 0; i<this.fPageOutlineTargets.length; i++){
				vTarget = this.fPageOutlineTargets[i];
				vTargetOffset = this.xGetOffsetTop(vTarget, this.fContent);
				vNextTargetOffset = (i < this.fPageOutlineTargets.length-1) ? this.xGetOffsetTop(this.fPageOutlineTargets[i+1], this.fContent) : null;
				vTargetHeight = vTarget.offsetHeight;
				if(vTargetOffset >= this.fScrollPos && vTargetOffset - this.fScrollPos < vContentHeight-vTargetHeight) break;
				else if(vNextTargetOffset && vNextTargetOffset > vContentHeight + this.fScrollPos) break;
			}
		}
		for (i = 0; i<this.fPageOutlineAnchors.length; i++) this.xSwitchClass(this.fPageOutlineAnchors[i], "currentSection_yes", "currentSection_no", true);
		this.xSwitchClass(vTarget.fAnchor, "currentSection_no", "currentSection_yes", true);
		this.fMenuRule.updateNode(vTarget.fAnchor);
	},
	declareOutline : function(pUrl){
		scCoLib.util.log("tplMgr.declareOutline: "+pUrl);
		this.fUrlOutline = pUrl;
	},
	getOutline : async function() {
		if (!this.fOutlineSrc){
			try{
				const vReq = await fetch(this.fUrlOutline);
				if (!vReq.ok) throw new Error(`Status: ${vReq.status}`);
				this.fOutlineSrc = JSON.parse(await vReq.text());
				const iOutlineSetup = function (pItem) {
					if (pItem.children) {
						for (let i = 0; i < pItem.children.length; i++) {
							pItem.children[i].parent = pItem;
							iOutlineSetup(pItem.children[i]);
						}
					}
				};
				iOutlineSetup(this.fOutlineSrc.module);
				return this.fOutlineSrc
			} catch (e) {
				console.error(`ERROR - tplMgr.getOutline : ${e}`);
				return null;
			}
		} else return this.fOutlineSrc;
	},
	makeVisible : function(pNode){
		// Ouvre bloc collapsable contenant pNode
		const vCollBlk = scPaLib.findNode("anc:.collBlk_closed", pNode);
		if(vCollBlk) vCollBlk.fTitle.onclick();
	},
	toggleMenu : function(pForceOpen){
		if (pForceOpen) this.fMenuOpen = false;
		if (this.fMenuOpen) this.xSwitchClass(document.body, "showMenu", "hideMenu", true);
		else this.xSwitchClass(document.body, "hideMenu", "showMenu", true);
		this.fMenuOpen = !this.fMenuOpen;
		this.fToggleMenuButton.title = this.fStrings[(this.fMenuOpen ? 1 : 0)];
		this.fToggleMenuButton.innerHTML = '<span>'+this.fStrings[(this.fMenuOpen ? 23 : 22)]+'</span>';
		localStorage.setItem("toggleMenu", this.fMenuOpen);
	},
	toggleInfo : function(){
		if (this.fInfoOpen) {
			this.xSwitchClass(document.body, "showInfo", "hideInfo", true);
			history.replaceState(null, null, ' ');
		} else{
			this.xSwitchClass(document.body, "hideInfo", "showInfo", true);
			window.location.replace(scCoLib.hrefBase() + "#displayinfo");
			}
		this.fInfoOpen = !this.fInfoOpen;
		this.fToggleInfoButton.title = this.fStrings[(this.fInfoOpen ? 3 : 2)];
		this.fToggleInfoButton.innerHTML = '<span>'+this.fStrings[(this.fInfoOpen ? 21 : 20)]+'</span>';
	},
	toggleSldMode: function() {
		if (this.fSldMode === true) {
			sessionStorage.setItem('sldMode', false);
			window.location.reload();
		} else {
			function initSldMode() {
				if (postscriptumMgr.isReady() && mathjaxMgr.isReady()) {
					if (document.body.classList.contains('hasMenu')) tplMgr.xSwitchClass(document.body, "noMenu", "floatMenu", true);
					if (document.body.classList.contains('showMenu')) tplMgr.toggleMenu();
					if (document.body.classList.contains('showInfo')) tplMgr.xSwitchClass(document.body, "showInfo", "hideInfo", true);
					document.body.classList.add("sldMode");
					postscriptum.css.REGISTER_PROPERTIES = false;
					const vProcessor = postscriptum.pagination({
						source: tplMgr.fContent,
						media: 'projection',
						defaultPageSize: [window.innerWidth + 'px', tplMgr.fContent.clientHeight + 'px'],
						css: [scServices.scLoad.resolveDestUri("/skin/sld.css")],
						preprocessCSS: false
					});
					vProcessor
						.use('cp-slideshow')
						.on('end', function () {
							sessionStorage.setItem('sldMode', true);
							postscriptumMgr.removeLoadMask();
							tplMgr.fSldMode = true;
						})
						.start();
				}
			}
			postscriptumMgr.addLoadMask(tplMgr.fContent.parentNode);
			postscriptumMgr.init([ 'cp-slideshow' ], initSldMode);
			if (!mathjaxMgr.isReady()) mathjaxMgr.register(initSldMode);
			this.fireEvent("slideMode", true);
		}
	},
	registerListener : function(pListener, pFunc){
		if (this.fListeners[pListener]) this.fListeners[pListener].push(pFunc);
		else scCoLib.log("ERROR - tplMgr.registerListener - non-existent listener : " + pListener);
	},
	fireEvent : function(pListener, pParam){
		if (this.fListeners[pListener]) for (let i=0; i< this.fListeners[pListener].length; i++) this.fListeners[pListener][i](pParam);
		else scCoLib.log("ERROR - tplMgr.fireEvent - non-existent listener : " + pListener);
	},
	/** Load page in search */
	loadPage : function(pUrl){
		if (pUrl && pUrl.length>0) window.location.href = scServices.scLoad.getRootUrl() + "/" + pUrl;
	},
	/** scrollTo in search */
	scrollTo : function(pId){
		this.loadPage(this.fPageCurrent +"#" + pId, true);
	},
	setHistory : function(pHref) {
		if (tplMgr.fLinkHistory.length===0 || pHref !== tplMgr.fLinkHistory[0].href) tplMgr.fLinkHistory.unshift({title:scPaLib.findNode("des:h1/chi:span").textContent, href:pHref});
		sessionStorage.setItem("linkHistory", JSON.stringify(tplMgr.fLinkHistory));
	},
	resetHistory : function(pHref) {
		for (let i=0; i<this.fLinkHistory.length; i++) {
			if (this.fLinkHistory[i].href.includes(pHref)){
				this.fLinkHistory.splice(0, i+1);
				sessionStorage.setItem("linkHistory", JSON.stringify(tplMgr.fLinkHistory));
				break;
			}
		}
	},

	/* === Callback functions =================================================== */
	/** Tooltip lib show callback */
	sTtShow: function(pNode) {
		if (!pNode.fOpt.FOCUS && !pNode.onblur) pNode.onblur = function(){scTooltipMgr.hideTooltip(true);};
	},
	/** Tooltip lib hide callback : this = scTooltipMgr */
	sTtHide: function(pNode) {
		if (pNode) pNode.focus();
	},

	/* === Utilities ============================================================ */
	/** tplMgr.xIsContainedBy : */
	xIsContainedBy : function(pNode, pAncestor) {
		if (!pNode || !pAncestor) return false;
		try{
			let vParent = pNode.parentNode;
			while (pAncestor !== vParent) vParent = vParent.parentNode;
			return true;
		} catch(e){
			return false;
		}
	},

	/** tplMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		const vBtn = pParent.ownerDocument.createElement("button");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},

	/** tplMgr.xSwitchClass - replace a class name. */
	xSwitchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
		const vAddIfAbsent = typeof pAddIfAbsent == "undefined" ? false : pAddIfAbsent;
		const vMatchExact = typeof pMatchExact == "undefined" ? true : pMatchExact;
		const vClassName = pNode.className;
		const vReg = new RegExp("\\b" + pClassNew + "\\b");
		if (vMatchExact && vClassName.match(vReg)) return;
		let vClassFound = false;
		if (pClassOld && pClassOld !== "") {
			if (vClassName.indexOf(pClassOld)===-1){
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew !== '') pNode.className = vClassName + " " + pClassNew;
			} else {
				const vCurrentClasses = vClassName.split(' ');
				const vNewClasses = [];
				let i = 0;
				const n = vCurrentClasses.length;
				for (; i < n; i++) {
					const vCurrentClass = vCurrentClasses[i];
					if (vMatchExact && vCurrentClass !== pClassOld || !vMatchExact && vCurrentClass.indexOf(pClassOld) !== 0) {
						vNewClasses.push(vCurrentClasses[i]);
					} else {
						if (pClassNew && pClassNew !== '') vNewClasses.push(pClassNew);
						vClassFound = true;
					}
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
		return vClassFound;
	},

	xGetOffsetTop : function(pNode, pContainer) {
		let vParent = pNode.offsetParent;
		if(!vParent) return Number.NaN;
		let vOffset = pNode.offsetTop;
		while(vParent !== pContainer) {
			const vNewParent = vParent.offsetParent;
			if(!vNewParent) return Number.NaN;
			vOffset += vParent.offsetTop;
			vParent = vNewParent;
		}
		return vOffset;
	},

	/** Local Storage API (localStorage/userData/cookie) */
	Storage : function (pId, pRootKey){
		if (pId && !/^[a-z][a-z0-9]+$/.exec(pId)) throw new Error("Invalid store name");
		this.fId = (typeof pId != "undefined") ? pId : "";
		this.fRootKey = (typeof pRootKey != "undefined") ? pRootKey : scServices.scLoad.getRootUrl();
		this.localGet = function(pKey) {
			const vRet = localStorage.getItem(this.fRootKey + this.xKey(pKey));return (typeof vRet == "string" ? vRet : null)};
		this.localSet = function(pKey, pVal) {localStorage.setItem(this.fRootKey+this.xKey(pKey), pVal)};
		this.sessionGet = function(pKey) {
			const vRet = sessionStorage.getItem(this.fRootKey + this.xKey(pKey));return (typeof vRet == "string" ? vRet : null)};
		this.sessionSet = function(pKey, pVal) {sessionStorage.setItem(this.fRootKey+this.xKey(pKey), pVal)};
		this.xKey = function(pKey){return this.fId + this.xEsc(pKey)};
	},

	/* === Tasks ============================================================== */
	/** tplMgr.scrollTask : menu scroll timer & size task */
	scrollTask : {
		fClassOffUp : "btnOff",
		fClassOffDown : "btnOff",
		fSpeed : 0,
		execTask : function(){
			try {
				if(this.fSpeed === 0) return false;
				tplMgr.fMenu.scrollTop += this.fSpeed;
				return true;
			}catch(e){
				this.fSpeed = 0;
				return false;
			}
		},
		step: function(pPx) {
			try { tplMgr.fMenu.scrollTop += pPx; }catch(e){}
		},
		checkBtn: function(){
			const vScrollTop = tplMgr.fMenu.scrollTop;
			const vBtnUpOff = tplMgr.fSrlUp.className.indexOf(this.fClassOffUp);
			if(vScrollTop <= 0) {
				if(vBtnUpOff < 0) tplMgr.fSrlUp.className+= " "+this.fClassOffUp;
			} else {
				if(vBtnUpOff >= 0) tplMgr.fSrlUp.className = tplMgr.fSrlUp.className.substring(0, vBtnUpOff);
			}

			const vContentH = scSiLib.getContentHeight(tplMgr.fMenu);
			const vBtnDownOff = tplMgr.fSrlDwn.className.indexOf(this.fClassOffDown);
			if( vContentH - vScrollTop <= tplMgr.fMenu.offsetHeight){
				if(vBtnDownOff < 0) tplMgr.fSrlDwn.className+= " "+this.fClassOffDown;
			} else {
				if(vBtnDownOff >=0) tplMgr.fSrlDwn.className = tplMgr.fSrlDwn.className.substring(0, vBtnDownOff);
			}
		},
		onResizedAnc:function(pOwnerNode, pEvent){
			if(pEvent.phase===2) this.checkBtn();
		},
		ruleSortKey : "checkBtn"
	}
}

/** Local Storage API (localStorage/cookie) */
function LocalStore(pId){
	if (pId && !/^[a-z][a-z0-9]+$/.exec(pId)) throw new Error("Invalid store name");
	this.fId = pId || "";
	this.fRootKey = scServices.scLoad.fRootUrl;
	if ("localStorage" in window && typeof window.localStorage != "undefined") {
		this.get = function(pKey) {
			const vRet = localStorage.getItem(this.fRootKey + this.xKey(pKey));return (typeof vRet == "string" ? unescape(vRet) : null)};
		this.set = function(pKey, pVal) {localStorage.setItem(this.fRootKey+this.xKey(pKey), escape(pVal))};
	} else {
		this.get = function(pKey){
			const vReg = new RegExp(this.xKey(pKey) + "=([^;]*)");
			const vArr = vReg.exec(document.cookie);if(vArr && vArr.length===2) return(unescape(vArr[1]));else return null};
		this.set = function(pKey,pVal){document.cookie = this.xKey(pKey)+"="+escape(pVal)};
	}
	this.xKey = function(pKey){return this.fId + this.xEsc(pKey)};
	this.xEsc = function(pStr){return "LS" + pStr.replace(/ /g, "_")};
}


/** ### ScSiRuleEnsureVisible ######### */
function ScSiRuleEnsureVisible(pPathNode, pPathContainer) {
	this.fPathNode = pPathNode;
	this.fPathContainer = pPathContainer;
	this.fEnable = true;
	scOnLoads[scOnLoads.length] = this;
}
ScSiRuleEnsureVisible.prototype = {
	enable : function(pState) {
		this.fEnable = pState;
	},
	updateNode : function(pNode) {
		this.fEnable = true;
		this.fNode = pNode;
		if(!this.fNode) this.fEnable = false;
		this.fContainer = scPaLib.findNode(this.fPathContainer, this.fNode);
		if(!this.fContainer) this.fEnable = false;
		this.xEnsureVis();
	},
	updateNodePath : function(pPathNode) {
		this.fEnable = true;
		if (typeof pPathNode != "undefined") this.fPathNode = pPathNode;
		this.fNode = scPaLib.findNode(this.fPathNode);
		if(!this.fNode) this.fEnable = false;
		this.fContainer = scPaLib.findNode(this.fPathContainer, this.fNode);
		if(!this.fContainer) this.fEnable = false;
		this.xEnsureVis();
	},
	onResizedAnc : function(pOwnerNode, pEvent) {
		if(pEvent.phase===1 || pEvent.resizedNode === pOwnerNode) return;
		this.xEnsureVis();
	},
	onResizedDes : function(pOwnerNode, pEvent) {
		if(pEvent.phase===1) return;
		this.xEnsureVis();
	},
	xEnsureVis : function() {
		if (!this.fEnable) return;
		const vOffsetTop = scSiLib.getOffsetTop(this.fNode, this.fContainer) + this.fContainer.scrollTop;
		const vOffsetMiddle = vOffsetTop + this.fNode.offsetHeight / 2;
		const vMiddle = this.fContainer.clientHeight / 2;
		this.fContainer.scrollTop = Math.min(vOffsetMiddle - vMiddle, vOffsetTop);
	},
	onLoad : function() {
		try {
			if (this.fPathNode) this.fNode = scPaLib.findNode(this.fPathNode);
			if(!this.fNode) this.fEnable = false;
			this.fContainer = scPaLib.findNode(this.fPathContainer, this.fNode);
			if(!this.fContainer) this.fEnable = false;
			else{
				scSiLib.addRule(this.fContainer, this);
				this.xEnsureVis();
			}
		} catch(e){scCoLib.log("ScSiRuleEnsureVisible.onLoad error : "+e);}
	},
	loadSortKey : "SiZ",
	ruleSortKey : "Z"
};
