(() => {
  "use strict";

  const dnsData = {
    "serveur.snt.test": "192.0.2.25 (enregistrement A)",
    "ipv6.snt.test": "2001:db8::25 (enregistrement AAAA)",
    "inconnu.snt.test": null
  };

  const dnsButton = document.querySelector("#dns-resolve");
  if (dnsButton) {
    dnsButton.addEventListener("click", () => {
      const name = document.querySelector("#dns-name").value;
      const result = document.querySelector("#dns-result");
      result.textContent = dnsData[name]
        ? `${name} → ${dnsData[name]}`
        : `${name} → aucune réponse dans la zone simulée`;
    });
  }

  const svg = document.querySelector("#network-svg");
  const packet = document.querySelector("#packet-icon");
  const packetStatus = document.querySelector("#packet-status");
  const cutLink = document.querySelector("#link-r2-r4");
  let cut = false;
  let running = false;

  const coordinates = {
    client:[65,165], r1:[210,165], r2:[370,80], r3:[370,250], r4:[555,165], server:[705,165]
  };

  function activateNode(name) {
    svg?.querySelectorAll("[data-node]").forEach(node => {
      node.classList.toggle("active", node.dataset.node === name);
    });
  }

  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  async function sendPacket() {
    if (!packet || running) return;
    running = true;
    packet.hidden = false;
    const route = cut ? ["client","r1","r3","r4","server"] : ["client","r1","r2","r4","server"];
    for (let i=0; i<route.length; i++) {
      const node = route[i];
      const [x,y] = coordinates[node];
      packet.setAttribute("transform", `translate(${x} ${y})`);
      activateNode(node);
      packetStatus.textContent = i === 0
        ? "Le paquet quitte le client."
        : i === route.length - 1
          ? `Le paquet atteint le serveur après ${route.length-2} routeurs.`
          : `Décision locale : passage par ${node.toUpperCase()}.`;
      await wait(650);
    }
    running = false;
  }

  document.querySelector("#packet-send")?.addEventListener("click", sendPacket);
  document.querySelector("#packet-cut")?.addEventListener("click", () => {
    if (running) return;
    cut = !cut;
    cutLink?.classList.toggle("cut", cut);
    packetStatus.textContent = cut
      ? "La liaison R2–R4 est coupée : un chemin alternatif sera choisi."
      : "La liaison R2–R4 est rétablie.";
  });
  document.querySelector("#packet-reset")?.addEventListener("click", () => {
    if (running) return;
    cut = false;
    cutLink?.classList.remove("cut");
    packet.hidden = true;
    activateNode("");
    packetStatus.textContent = "Le paquet attend au départ.";
  });

  const segments = [...document.querySelectorAll("#tcp-segments span")];
  const tcpStatus = document.querySelector("#tcp-status");
  function resetTcp() {
    segments.forEach(s => s.className = "");
    if (tcpStatus) tcpStatus.textContent = "Les segments sont prêts.";
  }
  async function animateTcp(loss) {
    resetTcp();
    const order = [0,2,1,3];
    for (const idx of order) {
      await wait(350);
      if (loss && idx === 1) {
        segments[idx].classList.add("lost");
        tcpStatus.textContent = "Le segment 2 manque : le message ne peut pas encore être livré.";
      } else {
        segments[idx].classList.add("sent");
        tcpStatus.textContent = `Segment ${idx+1} reçu.`;
      }
    }
    if (loss) {
      await wait(800);
      segments[1].classList.remove("lost");
      segments[1].classList.add("retransmitted");
      tcpStatus.textContent = "Segment 2 retransmis : TCP peut réordonner et livrer BONJOUR NÉO.";
    } else {
      tcpStatus.textContent = "Tous les segments sont présents : ils sont remis dans l’ordre.";
    }
  }
  document.querySelector("#tcp-run")?.addEventListener("click", () => animateTcp(false));
  document.querySelector("#tcp-loss")?.addEventListener("click", () => animateTcp(true));
  document.querySelector("#tcp-reset")?.addEventListener("click", resetTcp);
})();
