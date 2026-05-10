(function (){
	if ("scAssmntMgr" in window){
		scAssmntMgr.xGmcqInitMarker = function(pElt, pMgr){}
	}
	/* ajout label derrière inputs des choiceList pour stylage*/
	try{
		var vInputs=scPaLib.findNodes("des:.choiceList_in/des:input");
		for (i = 0; i < vInputs.length; i++) {
			var vLabel = document.createElement("label");
			vLabel.setAttribute("for", vInputs[i].id);
			vInputs[i].parentNode.appendChild(vLabel);
		}
	}catch(e){}
})();

// Mathjax config
(function (){
	if ("mathjaxMgr" in window){
		mathjaxMgr.fConfig_TeX='{extensions:["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js","color.js","mhchem.js"]}';
	}
})();
