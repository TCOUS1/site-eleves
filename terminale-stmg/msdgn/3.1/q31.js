(() => {
    "use strict";

    /* ========================================================
       1. ETAT LOCAL DES REPONSES
       La clé v06 est volontairement conservée pour ne pas perdre
       les réponses déjà saisies lors des tests précédents.
       ======================================================== */
    const PREFIX = "msdgn-q31-v06:";
    const state = document.getElementById("q31-save-state");
    let timer = null;

    document.querySelectorAll("textarea[data-save]").forEach(area => {
        const key = PREFIX + "answer:" + area.dataset.save;

        try {
            const saved = localStorage.getItem(key);
            if (saved !== null) area.value = saved;
        } catch (_) {}

        area.addEventListener("input", () => {
            try {
                localStorage.setItem(key, area.value);
            } catch (_) {}

            if (state) state.textContent = "Réponse enregistrée";
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (state) state.textContent = "Réponses sauvegardées sur cet appareil";
            }, 1100);
        });
    });

    /* ========================================================
       2. SOMMAIRE
       ======================================================== */
    document.querySelectorAll(".q31-toc a").forEach(link => {
        link.addEventListener("click", () => {
            const details = link.closest("details");
            if (details) details.open = false;
        });
    });

    /* ========================================================
       3. CORRIGES DEPLIABLES
       - chaque corrigé reste ouvrable individuellement ;
       - le bouton global facilite l'usage enseignant ;
       - ?corriges=1 ouvre tous les corrigés au chargement.
       ======================================================== */
    const corrections = [...document.querySelectorAll(".q31-correction")];
    const correctionToggle = document.getElementById("q31-toggle-corrections");

    function updateCorrectionButton() {
        if (!correctionToggle) return;
        const allOpen = corrections.length > 0 && corrections.every(item => item.open);
        correctionToggle.setAttribute("aria-pressed", String(allOpen));
        correctionToggle.textContent = allOpen
            ? "Masquer tous les corrigés"
            : "Afficher tous les corrigés";
    }

    correctionToggle?.addEventListener("click", () => {
        const shouldOpen = !corrections.every(item => item.open);
        corrections.forEach(item => {
            item.open = shouldOpen;
        });
        updateCorrectionButton();
    });

    corrections.forEach(item => {
        item.addEventListener("toggle", updateCorrectionButton);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("corriges") === "1") {
        corrections.forEach(item => {
            item.open = true;
        });
    }
    updateCorrectionButton();

    /* ========================================================
       4. IMPRESSION / PDF
       Les textarea sont remplacés temporairement par des DIV afin
       d'éviter les chevauchements de champs entre deux pages PDF.
       Les corrigés sont toujours masqués par le CSS d'impression.
       ======================================================== */
    document.getElementById("q31-print")?.addEventListener("click", () => {
        window.print();
    });

    function ensurePrintMirrors() {
        document.querySelectorAll("textarea[data-save]").forEach(area => {
            let mirror = area.nextElementSibling;
            const inTable = Boolean(area.closest("table"));
            const expected = inTable ? "q31-print-cell" : "q31-print-response";

            if (!mirror || !mirror.classList.contains(expected)) {
                mirror = document.createElement("div");
                mirror.className = expected;

                if (!inTable) {
                    ["short", "medium", "analysis", "long"].forEach(size => {
                        if (area.classList.contains(size)) mirror.classList.add(size);
                    });
                }

                area.insertAdjacentElement("afterend", mirror);
            }

            mirror.textContent = area.value || "";
            mirror.setAttribute("aria-hidden", "true");
        });
    }

    function clearPrintMirrors() {
        document.querySelectorAll(".q31-print-response, .q31-print-cell").forEach(node => {
            node.remove();
        });
    }

    window.addEventListener("beforeprint", () => {
        clearPrintMirrors();
        ensurePrintMirrors();
    });

    window.addEventListener("afterprint", clearPrintMirrors);
})();
