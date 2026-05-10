window.dys = {
	fStrings : [
		/*00*/ "⚙","Afficher / cacher les options accessibilité",
		/*02*/ "Police OpenDyslexic","Activer / désactiver l\'usage de la police OpenDyslexic",
		/*04*/ "Lignes colorées","Activer / désactiver les lignes de textes en couleurs alternés",
		/*06*/ "Texte aéré","Activer / désactiver un plus grand espacement du texte",
		/*08*/ "-","Diminuer la taille de la police",
		/*10*/ "+","Augmenter la taille de la police",
		""],
	fPanelActive : false,
	fFontActive : false,
	fMoreSpace : false,
	fFontSize : 100,
	fAltLineColor : false,
	fListeners : [],

	init : function(pOptions) {
		this.fStore = new this.LocalStore();
		if (pOptions) this.fOptions = pOptions;
		this.fBody = scPaLib.findNode("bod:");
		this.fRoot = scPaLib.findNode(this.fOptions.pathRoot);
		this.fContent = scPaLib.findNode(this.fOptions.pathContent);
		if (window.parent !== window && window.parent.dys){ // We are in an iframe register with the parent dys manager.
			if (this.fStore.get("dysFontActive")==="true") this.xToggleFont();
			if (this.fStore.get("dysAltLineColor")==="true") this.xToggleAltLineColor();
			if (this.fStore.get("dysMoreSpace")==="true") this.xToggleMoreSpace();
			if (this.fStore.get("dysFontSize")){
				this.fFontSize = Number(this.fStore.get("dysFontSize"));
				this.fContent.style.fontSize = this.fFontSize + "%";
			}
			window.parent.dys.registerListener(function (pAction) {
				if (dys[pAction]) dys[pAction]();
				else console.error("dys.listener : unknown action "+pAction);
			})
		} else {
			this.xBuildUi();
			if (this.fStore.get("dysPanelActive")==="true" && !this.fOptions.defaultPanelInactive) this.xTogglePanel(scPaLib.findNode("des:button.dysBtnTogglePanel"));
			if (this.fStore.get("dysFontActive")==="true") this.xToggleFont(scPaLib.findNode("des:button.dysBtnToggleFont"));
			if (this.fStore.get("dysAltLineColor")==="true") this.xToggleAltLineColor(scPaLib.findNode("des:button.dysBtnToggleAltLineColor"));
			if (this.fStore.get("dysMoreSpace")==="true") this.xToggleMoreSpace(scPaLib.findNode("des:button.dysBtnToggleMoreSpace"));
			if (this.fStore.get("dysFontSize")){
				this.fFontSize = Number(this.fStore.get("dysFontSize"));
				this.fContent.style.fontSize = this.fFontSize + "%";
				this.fFontSizeLbl.innerHTML = this.fFontSize + "%";
			}
		}
		scOnLoads[scOnLoads.length] = this;
	},
	onLoad : function() {
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
	},
	registerListener : function(pFunc){
		if (this.fListeners) this.fListeners.push(pFunc);
	},

	/* === Private ============================================================== */
	xBuildUi : function() {
		const vBtnParent = scPaLib.findNode(this.fOptions.pathBtnParent);
		const vPanelParent = scPaLib.findNode(this.fOptions.pathPanelParent);
		if (!vBtnParent || !vPanelParent) return;
		const bd = dom.newBd(vBtnParent);
		bd.elt("button", "dysBtnToggle").att("title", this.fStrings[1]).listen("click", function() {return dys.xTogglePanel(this)}).elt("span").text(this.fStrings[0]).up().up();
		bd.setCurrent(vPanelParent);
		bd.elt("div", "dysPanel").elt("span");
		bd.elt("span", "dysFontSizer");
		bd.elt("button", "dysBtn dysBtnFontSmaller").att("title", this.fStrings[9]).listen("click",function() {return dys.xFontSmaller()}).elt("span").text(this.fStrings[8]).up().up();
		this.fFontSizeLbl = bd.elt("span", "dysFontSizeLbl").text(this.fFontSize + "%").currentUp();
		bd.elt("button", "dysBtn dysBtnFontLarger").att("title", this.fStrings[11]).listen("click",function() {return dys.xFontLarger()}).elt("span").text(this.fStrings[10]).up().up().up();
		bd.elt("button", "dysBtnCheck_false dysBtnToggleFont").att("title", this.fStrings[3]).listen("click",function() {return dys.xToggleFont(this)}).elt("span").text(this.fStrings[2]).up().up();
		bd.elt("button", "dysBtnCheck_false dysBtnToggleAltLineColor").att("title", this.fStrings[5]).listen("click",function() {return dys.xToggleAltLineColor(this)}).elt("span").text(this.fStrings[4]).up().up();
		bd.elt("button", "dysBtnCheck_false dysBtnToggleMoreSpace").att("title", this.fStrings[7]).listen("click",function() {return dys.xToggleMoreSpace(this)}).elt("span").text(this.fStrings[6]).up().up();
	},
	xAltLineColorInit : function() {
		const vTextNodes = [];
		const vIgnoreFilter = scPaLib.compileFilter(this.fOptions.ignoreFilter);
		const textNodeWalker = function (pNde) {
			while (pNde) {
				if (pNde.nodeType === 3) vTextNodes.push(pNde);
				else if (pNde.nodeType === 1 && !scPaLib.checkNode(vIgnoreFilter, pNde)) textNodeWalker(pNde.firstChild);
				pNde = pNde.nextSibling;
			}
		};
		textNodeWalker(this.fContent.firstChild);
		for (let i=0; i<vTextNodes.length; i++) {
			const vTextNode = vTextNodes[i];
			const vTextSplit = vTextNode.nodeValue.replace(/(\S+)/g, function (pWrd) {
				return '<span class="dysColor_">' + pWrd + '</span>';
			});
			const vHolder = scDynUiMgr.addElement("span", vTextNode.parentNode, null, vTextNode);
			vTextNode.parentNode.removeChild(vTextNode);
			vHolder.innerHTML = vTextSplit;
		}
		this.fAltLineColorSpans = scPaLib.findNodes("des:span.dysColor_", this.fContent);
		this.fAltLineColorInit = true;
		this.fAltLineLastColor=0;
		this.fAltLineLastVert=0;
		scSiLib.addRule(this.fRoot, {
			onResizedAnc:function(pOwnerNode, pEvent){
				if(pEvent.phase===1 || pEvent.resizedNode === pOwnerNode) return;
				dys.xAltLineColorUpdate();
			},
			onResizedDes:function(pOwnerNode, pEvent){
				if(pEvent.phase===1) return;
				dys.xAltLineColorUpdate();
			},
			ruleSortKey : "checkAltLineColor"
		});
		this.xAltLineColorUpdate();
	},
	xAltLineColorUpdate : function() {
		const getY = function (pElt) {
			const vStopFilter = scPaLib.compileFilter("body");
			for (var vY = 0; pElt != null && !scPaLib.checkNode(vStopFilter, pElt); vY += pElt.offsetTop, pElt = pElt.offsetParent) ;
			return vY;
		};
		for (let i=0; i<this.fAltLineColorSpans.length; i++) {
			const vSpan = this.fAltLineColorSpans[i];
			const vCurrVert = getY(vSpan) + vSpan.offsetHeight/2;
			if (vSpan.checkVisibility() && (this.fAltLineLastVert > vCurrVert+3 || this.fAltLineLastVert < vCurrVert-3)) {
				this.fAltLineLastVert = vCurrVert;
				this.fAltLineLastColor = (this.fAltLineLastColor + 1) % 3;
			}
			this.switchClass(vSpan, "dysColor_", "dysColor_"+this.fAltLineLastColor, false, false);
		}
	},


	xTogglePanel : function(pBtn) {
		this.fPanelActive = !this.fPanelActive;
		this.switchClass(this.fBody, "dysPanelActive_"+!this.fPanelActive, "dysPanelActive_"+this.fPanelActive, true);
		this.fStore.set("dysPanelActive", this.fPanelActive);
		return false;
	},
	xToggleFont : function(pBtn) {
		this.fFontActive = !this.fFontActive;
		if (pBtn) this.switchClass(pBtn, "dysBtnCheck_"+!this.fFontActive, "dysBtnCheck_"+this.fFontActive);
		this.switchClass(this.fBody, "dysFontActive_"+!this.fFontActive, "dysFontActive_"+this.fFontActive, true);
		this.fStore.set("dysFontActive", this.fFontActive);
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		this.xFireEvent("xToggleFont");
	},
	xToggleAltLineColor : function(pBtn) {
		this.fAltLineColor = !this.fAltLineColor;
		if (!this.fAltLineColorInit) {
			if ("mathjaxMgr" in window){
				if (mathjaxMgr.fActive) mathjaxMgr.register(function(){dys.xAltLineColorInit();});
				else dys.xAltLineColorInit();
			} else dys.xAltLineColorInit();
		}
		if (pBtn) dys.switchClass(pBtn, "dysBtnCheck_"+!this.fAltLineColor, "dysBtnCheck_"+this.fAltLineColor);
		this.switchClass(this.fBody, "dysAltLineColor_"+!this.fAltLineColor, "dysAltLineColor_"+this.fAltLineColor, true);
		this.fStore.set("dysAltLineColor", this.fAltLineColor);
		this.xFireEvent("xToggleAltLineColor");
	},
	xToggleMoreSpace : function(pBtn) {
		this.fMoreSpace = !this.fMoreSpace;
		if (pBtn) this.switchClass(pBtn, "dysBtnCheck_"+!this.fMoreSpace, "dysBtnCheck_"+this.fMoreSpace);
		this.switchClass(this.fBody, "dysMoreSpace_"+!this.fMoreSpace, "dysMoreSpace_"+this.fMoreSpace, true);
		this.fStore.set("dysMoreSpace", this.fMoreSpace);
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		this.xFireEvent("xToggleMoreSpace");
	},
	xFontSmaller : function() {
		this.fFontSize -= 10;
		this.fFontSize = Math.max(this.fFontSize, 50);
		this.fContent.style.fontSize = this.fFontSize + "%";
		this.fStore.set("dysFontSize", this.fFontSize);
		if (this.fFontSizeLbl) this.fFontSizeLbl.innerHTML = this.fFontSize + "%";
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		this.xFireEvent("xFontSmaller");
	},
	xFontLarger : function() {
		this.fFontSize += 10;
		this.fFontSize = Math.min(this.fFontSize, 200);
		this.fContent.style.fontSize = this.fFontSize + "%";
		this.fStore.set("dysFontSize", this.fFontSize);
		if (this.fFontSizeLbl) this.fFontSizeLbl.innerHTML = this.fFontSize + "%";
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		this.xFireEvent("xFontLarger");
	},

	xFireEvent : function(pParam){
		for (let i=0; i< this.fListeners.length; i++) this.fListeners[i](pParam);
	},

	/* === Utilities ============================================================ */

	/** dys.switchClass - replace a class name. */
	switchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
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
					if (vMatchExact && vCurrentClass !== pClassOld || !vMatchExact && vCurrentClass.indexOf(pClassOld) < 0) {
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
	LocalStore : function(pId){
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
	},
	loadSortKey : "ZZZZ"
}
dys.init(dysOptions);