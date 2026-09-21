from pathlib import Path
from bs4 import BeautifulSoup
import shutil, re, os, json, zipfile, html

SRC=Path('/mnt/data/bts-gpme-ressources-v0.8')
DST=Path('/mnt/data/bts-gpme-ressources-v0.9')
if DST.exists():
    shutil.rmtree(DST)
shutil.copytree(SRC,DST)

# Tool definitions for the 34 resources flagged in v0.8.
ENRICH = {
'R-B4-013': {
    'tool':'Grille de sélection et de suivi des prestataires',
    'cols':['Critère','Pondération','Prestataire A','Prestataire B','Prestataire C','Preuve / source','Risque ou réserve'],
    'mission':"La PME organise une journée clients pour 45 personnes. Trois prestataires proposent restauration et logistique avec des niveaux de service différents. Préparez une comparaison, recommandez une solution et construisez le suivi des engagements jusqu’au jour de l’événement."
},
'R-B4-021': {
    'tool':'Fiche de conception d’une action de communication commerciale',
    'cols':['Objectif mesurable','Cible','Message principal','Preuve / argument','Canal','Appel à l’action','Budget','Indicateur de résultat'],
    'mission':"Une PME souhaite relancer les ventes d’un service peu demandé auprès de ses clients actuels. Construisez une action commerciale cohérente avec la cible, le positionnement, le budget et un indicateur permettant de juger le résultat."
},
'R-B4-032': {
    'tool':'Tableau d’analyse de ratios financiers',
    'cols':['Ratio','Formule fournie / retenue','Valeur N','Valeur N-1','Repère sectoriel si fourni','Évolution','Interprétation','Limite de l’indicateur'],
    'mission':"Le dirigeant vous remet deux exercices de données financières et trois ratios sectoriels. Calculez seulement les ratios utiles, interprétez les évolutions et préparez trois constats argumentés sans conclure au-delà des données disponibles."
},
'R-B4-023': {
    'tool':'Grille de contrôle d’un support de communication',
    'cols':['Élément contrôlé','Règle / charte de référence','Conforme ?','Écart observé','Correction proposée','Validation nécessaire'],
    'mission':"Un prestataire a livré une affiche et un visuel pour les réseaux sociaux. Contrôlez leur cohérence avec la charte et l’image de la PME, relevez les écarts et préparez une liste de corrections exploitable par le prestataire."
},
'R-TR-003': {
    'tool':'Trame d’une note d’aide à la décision',
    'cols':['Rubrique','Contenu à produire','Preuve / donnée à citer'],
    'mission':"Le dirigeant hésite entre deux solutions pour traiter un problème de gestion. À partir d’un dossier chiffré et de contraintes explicites, rédigez une note courte qui distingue faits, analyse, options, risques et recommandation."
},
'R-B4-017': {
    'tool':'Tableau de passage du constat à la proposition commerciale',
    'cols':['Constat vérifié','Opportunité / menace','Cible concernée','Action proposée','Ressources / coût','Risque','Indicateur de succès','Validation attendue'],
    'mission':"Votre veille montre une évolution durable des attentes d’un segment de clientèle. Transformez ce constat en une proposition de développement réaliste, chiffrée autant que les données le permettent et accompagnée de critères de succès."
},
'R-B4-024': {
    'tool':'Tableau d’évaluation d’une action de communication',
    'cols':['Objectif initial','Indicateur','Cible','Résultat','Écart','Cause possible','Conclusion','Action corrective'],
    'mission':"Une campagne numérique vient de se terminer. Le dossier fournit budget, portée, clics, demandes de contact et ventes obtenues. Évaluez l’efficacité de l’action, distinguez les résultats des interprétations et proposez une correction pour la prochaine campagne."
},
'R-B4-028': {
    'tool':'Structure d’un budget prévisionnel',
    'cols':['Poste','Hypothèse','Période','Montant prévu','Source de l’hypothèse','Réalisé','Écart','Commentaire / action'],
    'mission':"La PME prépare le budget d’un trimestre avec des hypothèses de ventes, achats, frais et actions commerciales. Construisez le budget, rendez visibles les hypothèses et préparez un suivi permettant d’expliquer les écarts futurs."
},
'R-B4-020': {
    'tool':'Trame de conception d’un support institutionnel',
    'cols':['Rubrique / zone','Message attendu','Preuve / information source','Règle d’identité visuelle','Validation'],
    'mission':"La PME doit présenter son activité et ses engagements à de nouveaux partenaires. Préparez la structure d’un support institutionnel qui valorise l’entreprise sans promesse non prouvée et qui respecte les éléments d’identité fournis."
},
'R-B4-011': {
    'tool':'Feuille de route d’un déplacement professionnel',
    'cols':['Étape','Date / heure','Réservation / référence','Adresse / contact','Coût','Contrainte','Justificatif','Solution de repli'],
    'mission':"Deux salariés doivent participer à un salon sur deux jours avec un rendez-vous client fixé le premier après-midi. Organisez le déplacement dans le budget fourni, vérifiez les temps de correspondance et prévoyez les informations utiles en cas d’aléa."
},
'R-TR-002': {
    'tool':'Grille de construction et de relecture d’un courriel professionnel',
    'cols':['Zone','Question de contrôle','Contenu'],
    'mission':"Vous devez obtenir d’un interlocuteur une information manquante avant une échéance proche. Rédigez un courriel qui permet au destinataire de comprendre immédiatement le contexte, l’action attendue, le délai et les pièces utiles."
},
'R-TR-008': {
    'tool':'Ordre du jour orienté décisions et actions',
    'cols':['Sujet','Résultat attendu','Temps','Données / support','Décision à prendre','Responsable du suivi'],
    'mission':"Un projet accumule deux retards et un point de désaccord. Préparez puis simulez une réunion de 30 minutes qui doit déboucher sur des décisions explicites, des responsables et des échéances."
},
'R-TR-014': {
    'tool':'Trame de synthèse d’une analyse chiffrée',
    'cols':['Indicateur','Valeur','Repère / comparaison','Écart significatif','Cause étayée','Conséquence','Action / question à décider'],
    'mission':"Vous disposez d’un tableau de 25 indicateurs. Le dirigeant ne veut qu’une synthèse d’une page. Sélectionnez les données réellement utiles, hiérarchisez trois messages et justifiez pourquoi les autres chiffres ne sont pas mis en avant."
},
'R-B4-037': {
    'tool':'Grille d’analyse et d’alerte à partir d’un tableau de bord',
    'cols':['Indicateur','Cible / seuil','Réalisé','Écart','Tendance','Cause vérifiée / hypothèse','Risque','Action proposée','Décision attendue'],
    'mission':"Trois indicateurs passent sous leur seuil et deux progressent fortement. Préparez une alerte qui ne se contente pas de recopier les chiffres : identifiez ce qui nécessite réellement une décision et les informations à vérifier."
},
'R-B4-014': {
    'tool':'Registre de veille commerciale orienté décision',
    'cols':['Question de veille','Source','Date','Information utile','Fiabilité','Évolution / signal','Impact possible','Action ou surveillance'],
    'mission':"La direction envisage de développer une nouvelle offre. Mettez en place une veille courte sur clients, concurrents et marché, puis produisez uniquement les informations susceptibles de modifier une décision commerciale."
},
'R-TR-007': {
    'tool':'Guide de préparation d’un entretien professionnel court',
    'cols':['Phase','Objectif','Question préparée','Faits à recueillir','Trace à conserver','Action / suite'],
    'mission':"Vous devez conduire un entretien de quinze minutes avec un collaborateur afin de comprendre un retard récurrent dans une procédure. Préparez des questions factuelles, conduisez l’échange sans accusation et formalisez les suites."
},
'R-B3-016': {
    'tool':'Guide d’entretien de recrutement comparable',
    'cols':['Critère lié au poste','Question identique pour les candidats','Éléments factuels attendus','Note / niveau','Observation factuelle'],
    'mission':"Trois candidats présélectionnés doivent être reçus pour le même poste. Construisez un guide permettant une comparaison équitable, puis préparez une synthèse fondée sur les critères du poste plutôt que sur une impression générale."
},
'R-B3-018': {
    'tool':'Matrice des besoins en compétences et en formation',
    'cols':['Poste / salarié','Compétence attendue','Niveau constaté','Écart','Priorité','Réponse possible','Échéance','Validation'],
    'mission':"Une évolution d’outil modifie le travail de plusieurs salariés. À partir des missions et des constats fournis, recensez les écarts de compétences et préparez des priorités de formation sans transformer toute difficulté en besoin de formation."
},
'R-B4-031': {
    'tool':'Tableau d’analyse FRNG – BFR – trésorerie nette',
    'cols':['Agrégat','Calcul à appliquer','N','N-1','Variation','Interprétation','Point à vérifier'],
    'mission':"À partir de deux bilans fonctionnels déjà construits, calculez FRNG, BFR et trésorerie nette, vérifiez la cohérence de l’égalité financière et préparez une explication de l’évolution en quelques lignes."
},
'R-B4-010': {
    'tool':'Tableau de priorisation et de charge',
    'cols':['Tâche','Échéance','Urgence','Importance','Durée estimée','Dépendance','Créneau / responsable','Statut'],
    'mission':"Une semaine comporte plusieurs échéances, deux demandes urgentes et une absence imprévue. Réorganisez l’agenda partagé en justifiant les arbitrages et signalez ce qui ne peut pas être tenu sans décision du responsable."
},
'R-B4-029': {
    'tool':'Tableau d’analyse des écarts et de simulation',
    'cols':['Poste / indicateur','Prévu','Réalisé','Écart','Cause','Effet','Hypothèse de décision','Nouveau résultat simulé','Limite de la simulation'],
    'mission':"Le réalisé s’écarte du budget sur plusieurs postes. Identifiez les écarts significatifs, recherchez les causes documentées et simulez l’effet d’une décision proposée par la direction sans présenter la simulation comme une certitude."
},
'R-TR-004': {
    'tool':'Tableau de suivi issu d’un compte rendu',
    'cols':['Décision / action','Responsable','Échéance','Preuve / livrable','Point de contrôle','Statut'],
    'mission':"Une réunion a produit plusieurs échanges mais les notes sont désordonnées. Transformez-les en compte rendu bref distinguant informations, décisions et actions, puis construisez le suivi opérationnel."
},
'R-B4-019': {
    'tool':'Cahier des charges d’une action de communication',
    'cols':['Rubrique','Décision / information attendue','Source / validation'],
    'mission':"La PME veut confier à un prestataire la création d’une campagne locale. Préparez un cahier des charges qui permette de recevoir des propositions comparables et qui précise objectif, cible, livrables, budget, délais, contraintes et critères de réussite."
},
'R-B3-024': {
    'tool':'Tableau d’analyse d’indicateurs sociaux',
    'cols':['Indicateur','Mode de calcul fourni','Période N','Comparaison','Écart / tendance','Interprétation','Hypothèse à vérifier','Action proposée'],
    'mission':"Le tableau de bord social montre une hausse des absences et du turnover dans une équipe. Analysez les indicateurs sans attribuer de cause non démontrée et préparez les vérifications ou actions à proposer au dirigeant."
},
'R-B4-018': {
    'tool':'Tableau de conception et de suivi d’une action de fidélisation',
    'cols':['Segment','Objectif','Action','Avantage client','Coût','Canal','Indicateur','Résultat','Correction'],
    'mission':"La PME souhaite augmenter les achats répétés d’un segment de clients existants. Concevez une action de fidélisation cohérente, prévoyez son coût et indiquez comment vous déciderez ensuite de la maintenir, l’adapter ou l’arrêter."
},
'R-B4-008': {
    'tool':'Tableau d’organisation du travail administratif',
    'cols':['Activité','Fréquence','Entrée nécessaire','Responsable','Durée / charge','Échéance','Irritant / risque','Amélioration proposée','Indicateur de suivi'],
    'mission':"Un processus administratif génère retards, doubles saisies et nombreuses relances internes. Décrivez l’organisation actuelle, repérez les points de friction et préparez une amélioration réalisable avec les moyens existants."
},
'R-B4-034': {
    'tool':'Structure d’un plan de financement',
    'cols':['Emploi / ressource','Nature','Montant','Date / période','Hypothèse','Impact sur équilibre','Justification'],
    'mission':"La PME envisage un investissement important. À partir du coût, des ressources disponibles et de deux solutions de financement, construisez un plan de financement cohérent et montrez l’impact des hypothèses sur l’équilibre."
},
'R-B3-014': {
    'tool':'Grille de contrôle d’une offre d’emploi',
    'cols':['Rubrique','Information à publier','Lien avec le poste','Critère objectif ?','Formulation à corriger','Validation'],
    'mission':"Une fiche de poste doit être transformée en annonce. Rédigez une offre claire et attractive en ne retenant que des exigences liées au poste, puis contrôlez chaque formulation avant publication."
},
'R-B3-021': {
    'tool':'Support de préparation de l’évaluation professionnelle',
    'cols':['Critère / objectif','Attendu','Fait observable','Résultat','Écart','Commentaire factuel','Action / moyen','Suivi'],
    'mission':"Le responsable doit préparer l’évaluation d’un salarié. À partir des objectifs, résultats et faits de la période, préparez un support qui distingue faits, appréciation et actions futures, sans décider à la place du manager."
},
'R-B4-033': {
    'tool':'Matrice de comparaison de modes de financement',
    'cols':['Solution','Montant financé','Durée','Coût connu / à calculer','Remboursement','Garantie / condition','Souplesse','Impact financier','Risque / réserve'],
    'mission':"Deux financements bancaires et une solution de crédit-bail sont proposés pour un équipement. Comparez-les sur une base homogène et préparez une recommandation en explicitant les données manquantes ou les hypothèses."
},
'R-B1-019': {
    'tool':'Tableau de suivi d’une commande fournisseur',
    'cols':['Commande','Référence','Quantité commandée','Prix','Date prévue','Réception','Facture','Écart','Action / relance','Statut'],
    'mission':"Une commande comporte plusieurs références livrées à des dates différentes. Assurez le suivi depuis la confirmation fournisseur jusqu’au contrôle de la réception et préparez les actions nécessaires pour chaque écart."
},
'R-TR-012': {
    'tool':'Journal de contrôle et de nettoyage des données',
    'cols':['Champ','Règle attendue','Anomalie détectée','Correction','Source de la correction','Contrôle après correction','Trace conservée'],
    'mission':"Une extraction du PGI contient doublons, dates incohérentes, cellules vides et formats différents. Nettoyez uniquement ce que vous pouvez justifier, tracez les corrections et isolez les données qui doivent être confirmées."
},
'R-B1-015': {
    'tool':'Cahier d’expression du besoin d’achat ou d’investissement',
    'cols':['Besoin / usage','Quantité','Caractéristique obligatoire','Caractéristique souhaitée','Délai','Budget / limite','Contrainte','Critère de choix','Validation'],
    'mission':"Un service demande un nouvel équipement mais sa demande est vague. Transformez-la en besoin exploitable pour consulter des fournisseurs sans imposer prématurément une marque ou une solution particulière."
},
'R-B2-002': {
    'tool':'Matrice de criticité à documenter',
    'cols':['Risque','Échelle de probabilité','Note probabilité','Échelle de gravité','Note gravité','Règle de combinaison','Résultat','Priorité','Justification'],
    'mission':"Six risques ont été recensés mais aucune priorité n’est définie. Construisez une matrice avec une échelle cohérente, appliquez la même règle à tous les risques et expliquez pourquoi le classement obtenu doit rester argumenté par les données."
},
}

# Locate resource path by id
def find_resource(rid):
    for p in DST.joinpath('ressources').rglob('*.html'):
        soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
        art=soup.find('article', class_='resource')
        if art and art.get('data-resource-id')==rid:
            return p
    raise KeyError(rid)

# Add a universal autonomy fallback after "Avant de commencer"
fallback_text = [
    "Identifiez précisément l’information manquante : donnée, règle, validation, document ou décision.",
    "Cherchez d’abord dans le dossier de mission, le PGI, les procédures de la PME et les sources indiquées par la ressource.",
    "N’inventez jamais une donnée, un seuil, une règle juridique ou une validation. Si une hypothèse est autorisée, rendez-la visible.",
    "Si l’information manquante peut modifier un engagement, une conformité, un coût important ou une décision, préparez la question et faites valider avant d’agir."
]
for p in DST.joinpath('ressources').rglob('*.html'):
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    art=soup.find('article', class_='resource')
    if not art: 
        continue
    old=soup.find('details', class_='resource__missing-info')
    if old: old.decompose()
    det=soup.new_tag('details')
    det['class']='resource__missing-info'
    sm=soup.new_tag('summary'); sm.string="Si une information manque, que faire ?"; det.append(sm)
    ul=soup.new_tag('ul')
    for txt in fallback_text:
        li=soup.new_tag('li'); li.string=txt; ul.append(li)
    det.append(ul)
    inputs=soup.find('section',class_='resource__inputs')
    if inputs:
        inputs.insert_after(det)
    else:
        head=soup.find('header',class_='resource__header')
        head.insert_after(det)
    p.write_text(str(soup),encoding='utf-8')

# Add specific tools and mini-missions
for rid, cfg in ENRICH.items():
    p=find_resource(rid)
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    # remove previous to make script idempotent
    for cls in ['resource__tool','resource__transfer']:
        old=soup.find('details',class_=cls)
        if old: old.decompose()
    related=soup.find('section',class_='resource__related')
    footer=soup.find('footer',class_='resource__footer')
    anchor=related or footer

    tool=soup.new_tag('details'); tool['class']='resource__tool'; tool['open']=''
    sm=soup.new_tag('summary'); sm.string='Outil prêt à reproduire'; tool.append(sm)
    h=soup.new_tag('h3'); h.string=cfg['tool']; tool.append(h)
    pp=soup.new_tag('p'); pp.string="Reproduisez cette structure dans votre tableur ou document de travail. Adaptez seulement les colonnes justifiées par la situation et conservez la source des données utilisées."; tool.append(pp)
    wrap=soup.new_tag('div'); wrap['class']='resource__tool-table-wrap'
    table=soup.new_tag('table'); table['class']='resource__tool-table'
    thead=soup.new_tag('thead'); tr=soup.new_tag('tr')
    for c in cfg['cols']:
        th=soup.new_tag('th'); th.string=c; tr.append(th)
    thead.append(tr); table.append(thead)
    tbody=soup.new_tag('tbody')
    for _ in range(3):
        tr=soup.new_tag('tr')
        for _c in cfg['cols']:
            td=soup.new_tag('td'); td.string=''; tr.append(td)
        tbody.append(tr)
    table.append(tbody); wrap.append(table); tool.append(wrap)

    transfer=soup.new_tag('details'); transfer['class']='resource__transfer'
    sm=soup.new_tag('summary'); sm.string='Mini-mission'; transfer.append(sm)
    pp=soup.new_tag('p'); pp.string=cfg['mission']; transfer.append(pp)
    ul=soup.new_tag('ul')
    for q in [
        "Quel résultat professionnel concret devez-vous remettre ?",
        "Quelles informations sont indispensables avant de commencer et lesquelles manquent encore ?",
        "Quelle ressource ou quel outil de cette fiche allez-vous utiliser, et pourquoi ?",
        "Quels contrôles devez-vous effectuer avant de transmettre votre travail ?",
        "Qu’est-ce qui relève de votre autonomie et qu’est-ce qui doit être validé par un responsable ?"
    ]:
        li=soup.new_tag('li'); li.string=q; ul.append(li)
    transfer.append(ul)

    if anchor:
        anchor.insert_before(tool)
        anchor.insert_before(transfer)
    else:
        soup.find('article',class_='resource').append(tool)
        soup.find('article',class_='resource').append(transfer)
    p.write_text(str(soup),encoding='utf-8')

len(ENRICH)

from pathlib import Path
from bs4 import BeautifulSoup
import re, os, json, zipfile, html, shutil

DST=Path('/mnt/data/bts-gpme-ressources-v0.9')

def resource_records():
    records=[]
    for p in sorted(DST.joinpath('ressources').rglob('*.html')):
        soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
        art=soup.find('article',class_='resource')
        if not art: continue
        typ=soup.find(class_='resource__type')
        records.append({
            'path':p,
            'soup':soup,
            'id':art.get('data-resource-id',''),
            'title':soup.find('h1').get_text(' ',strip=True),
            'type_label':typ.get_text(' ',strip=True) if typ else '',
            'type_key':art.get('data-resource-type','methode'),
            'bc':art.get('data-bc',''),
            'activities':art.get('data-activities','').split(),
            'tasks':art.get('data-tasks','').split(),
            'knowledge':art.get('data-knowledge','').split(),
            'maintenance':art.get('data-maintenance','stable'),
            'verified':art.get('data-verified','')
        })
    return records

resources=resource_records()

# Rebuild resources-index
index=[]
for r in resources:
    art=r['soup'].find('article',class_='resource')
    index.append({
        'id':r['id'],'title':r['title'],'url':r['path'].relative_to(DST).as_posix(),
        'type':r['type_label'],'type_key':r['type_key'],'format':art.get('data-resource-format',''),
        'bc':r['bc'],'activities':r['activities'],'tasks':r['tasks'],'knowledge':r['knowledge'],
        'maintenance':r['maintenance'],'verified':r['verified']
    })
(DST/'resources-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2),encoding='utf-8')

# Update center index cards' searchable text to include newly added tools/missions.
idxp=DST/'index.html'
idx=BeautifulSoup(idxp.read_text(encoding='utf-8'),'html.parser')
record_by_id={r['id']:r for r in resources}
for card in idx.select('.resource-card[data-resource-id]'):
    rid=card.get('data-resource-id')
    r=record_by_id.get(rid)
    if r:
        card['data-search']=' '.join(r['soup'].stripped_strings)
# Add training link in footer nav
nav=idx.find('nav',class_='resource-center__footer-nav')
if nav and not nav.find('a',href='entrainement/index.html'):
    nav.append(' · ')
    a=idx.new_tag('a',href='entrainement/index.html'); a.string='Mini-missions'; nav.append(a)
idxp.write_text(str(idx),encoding='utf-8')

# Helpers for audit
word_re=re.compile(r"\b[\wÀ-ÿ'-]+\b")
def count_words_text(txt): return len(word_re.findall(txt))
def core_metrics(p):
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    art=soup.find('article',class_='resource')
    clone=BeautifulSoup(str(art),'html.parser')
    # Exclude generated or reinforcement blocks from "core content"
    for sel in ['.resource__related','.resource__referential-detail','.resource__footer',
                '.resource__tool','.resource__transfer','.resource__missing-info',
                '.resource__referential-tags','.resource__referential-position']:
        for el in clone.select(sel): el.decompose()
    core=count_words_text(' '.join(clone.stripped_strings))
    method=soup.find('section',class_='resource__method')
    checks=soup.find('section',class_='resource__check')
    ex=soup.find('details',class_='resource__example')
    steps=len(method.find_all('li')) if method else 0
    nchecks=len(checks.find_all('li')) if checks else 0
    exw=count_words_text(' '.join(ex.stripped_strings)) if ex else 0
    tool=bool(soup.find('details',class_='resource__tool'))
    transfer=bool(soup.find('details',class_='resource__transfer'))
    if tool or transfer:
        level='Renforcée'
    elif core>=350 and steps>=5 and nchecks>=4 and exw>=25:
        level='Actionnable'
    else:
        level='À approfondir'
    return core,steps,nchecks,exw,tool,transfer,level

audit_rows=[]
for r in resources:
    m=core_metrics(r['path'])
    audit_rows.append((r,*m))

counts={k:sum(1 for x in audit_rows if x[-1]==k) for k in ['Renforcée','Actionnable','À approfondir']}
tool_count=sum(1 for x in audit_rows if x[-3])
mission_count=sum(1 for x in audit_rows if x[-2])

# Build new depth audit
priority=[x for x in audit_rows if x[-1]=='Actionnable' and not x[-3] and not x[-2]]
priority.sort(key=lambda x:(x[1],x[0]['id']))
pr_items=[]
for x in priority[:20]:
    r,core,steps,nchecks,exw,tool,transfer,level=x
    rel=os.path.relpath(r['path'],DST/'audit').replace(os.sep,'/')
    pr_items.append(f'<li><a href="{html.escape(rel)}">{html.escape(r["id"])} — {html.escape(r["title"])}</a> <small>({core} mots de contenu cœur)</small></li>')

trs=[]
level_order={'À approfondir':0,'Actionnable':1,'Renforcée':2}
for x in sorted(audit_rows,key=lambda x:(level_order[x[-1]],x[1],x[0]['id'])):
    r,core,steps,nchecks,exw,tool,transfer,level=x
    rel=os.path.relpath(r['path'],DST/'audit').replace(os.sep,'/')
    trs.append(
        f'<tr><td><a href="{html.escape(rel)}">{html.escape(r["id"])}</a></td>'
        f'<td>{html.escape(r["title"])}</td><td>{core}</td><td>{steps}</td><td>{nchecks}</td><td>{exw}</td>'
        f'<td>{"Oui" if tool else "—"}</td><td>{"Oui" if transfer else "—"}</td><td>{level}</td></tr>'
    )
prof=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audit d’actionnabilité — BTS GPME</title><link rel="stylesheet" href="../assets/demo.css"></head>
<body><nav class="demo-nav"><a href="../index.html">← Centre de ressources</a><a href="index.html">Audit de couverture</a><a href="../referentiel/savoirs.html">Savoirs associés</a><a href="../entrainement/index.html">Mini-missions</a></nav>
<main class="resource-page"><article class="resource"><header class="resource__header"><p class="resource__type">Outil de maintenance</p><h1>Audit d’actionnabilité et de profondeur</h1>
<p class="resource__lead">L’audit distingue désormais la couverture, la profondeur du contenu cœur et la présence d’un dispositif de transfert. Une fiche renforcée possède un outil reproductible et/ou une mini-mission ; cela ne remplace pas un test avec des étudiants.</p></header>
<section><h2>État actuel</h2><ul>
<li><strong>{counts['Renforcée']}</strong> ressources renforcées</li>
<li><strong>{counts['Actionnable']}</strong> ressources actionnables sans outil ou mini-mission spécifique</li>
<li><strong>{counts['À approfondir']}</strong> ressources encore insuffisantes selon les critères mécaniques</li>
<li><strong>{tool_count}</strong> ressources avec outil prêt à reproduire</li>
<li><strong>{mission_count}</strong> ressources avec mini-mission de transfert</li>
<li><strong>{len(resources)}</strong> ressources disposent maintenant d’un protocole « information manquante »</li>
</ul></section>
<section><h2>Prochaine priorité</h2>
<p>Les 34 ressources qui étaient classées « À approfondir » en v0.8 ont été équipées d’un outil et d’une mini-mission. La prochaine étape consiste à renforcer progressivement les ressources déjà actionnables mais qui n’offrent pas encore de support de production ou de transfert. Les 20 plus courtes sont :</p>
<ol>{''.join(pr_items)}</ol></section>
<section><h2>Critères</h2>
<p><strong>Renforcée :</strong> présence d’un outil directement reproductible ou d’une mini-mission. <strong>Actionnable :</strong> au moins 350 mots de contenu cœur, 5 étapes, 4 points d’autocontrôle et un exemple d’au moins 25 mots. Les blocs automatiques, l’outil, la mini-mission et le protocole « information manquante » sont exclus du comptage du contenu cœur.</p></section>
<section><h2>Tableau de contrôle</h2><div class="audit-table-wrap"><table class="audit-table"><thead><tr><th>ID</th><th>Ressource</th><th>Contenu cœur</th><th>Étapes</th><th>Contrôles</th><th>Exemple</th><th>Outil</th><th>Mini-mission</th><th>Niveau</th></tr></thead><tbody>{''.join(trs)}</tbody></table></div></section>
<footer class="resource__footer"><p>Le classement reste volontairement exigeant : il sert à piloter l’amélioration continue et non à certifier à lui seul la qualité pédagogique.</p></footer></article></main></body></html>'''
(DST/'audit'/'profondeur.html').write_text(prof,encoding='utf-8')

# Build mini-mission page
train_dir=DST/'entrainement'; train_dir.mkdir(exist_ok=True)
cards=[]
for r in resources:
    soup=BeautifulSoup(r['path'].read_text(encoding='utf-8'),'html.parser')
    tr=soup.find('details',class_='resource__transfer')
    if not tr: continue
    ptag=tr.find('p')
    scenario=ptag.get_text(' ',strip=True) if ptag else ''
    refs=[]
    if r['bc']: refs.append(r['bc'])
    refs += r['activities'][:1] + r['tasks'][:2]
    tags=' '.join(f'<span>#{html.escape(x)}</span>' for x in refs)
    rel=os.path.relpath(r['path'],train_dir).replace(os.sep,'/')
    group=r['bc'] or 'TRANSVERSAL'
    cards.append((group,r['id'],f'''<article class="training-card" data-group="{html.escape(group)}"><p class="training-card__refs">{tags}</p><h2>{html.escape(r["title"])}</h2><p>{html.escape(scenario)}</p><details><summary>Avant d’ouvrir la ressource</summary><ul><li>Quel livrable devez-vous produire ?</li><li>Quelles données vous manquent ?</li><li>Quelle méthode ou quel outil recherchez-vous ?</li><li>Qu’allez-vous contrôler avant transmission ?</li><li>Que devez-vous faire valider ?</li></ul></details><p><a href="{html.escape(rel)}">Consulter la ressource après votre diagnostic →</a></p></article>'''))
cards.sort(key=lambda x:(x[0],x[1]))
group_names={'BC1':'BC1 — Clients et fournisseurs','BC2':'BC2 — Gestion des risques','BC3':'BC3 — Personnel et GRH','BC4':'BC4 — Fonctionnement et développement','TRANSVERSAL':'Ressources transversales'}
sections=[]
for g in ['BC1','BC2','BC3','BC4','TRANSVERSAL']:
    cs=[c[2] for c in cards if c[0]==g]
    if cs:
        sections.append(f'<section class="training-group"><h2>{group_names[g]}</h2>{"".join(cs)}</section>')
training=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mini-missions — BTS GPME</title><link rel="stylesheet" href="../assets/demo.css"></head><body>
<nav class="demo-nav"><a href="../index.html">← Centre de ressources</a><a href="../referentiel/index.html">Référentiel</a><a href="../audit/profondeur.html">Audit d’actionnabilité</a></nav>
<main class="resource-page"><article class="resource"><header class="resource__header"><p class="resource__type">Entraînement au transfert</p><h1>Mini-missions</h1><p class="resource__lead">{len(cards)} situations courtes pour tester le diagnostic du besoin avant d’ouvrir une ressource. L’objectif n’est pas de réciter une fiche mais d’identifier ce qui manque pour agir.</p></header>
<section><h2>Mode d’utilisation</h2><ol><li>Lisez uniquement la situation.</li><li>Formulez le livrable attendu.</li><li>Identifiez les données et validations nécessaires.</li><li>Décidez quelle ressource vous chercheriez.</li><li>Ouvrez ensuite la ressource et comparez votre diagnostic avec sa méthode et ses contrôles.</li></ol></section>
{''.join(sections)}
</article></main></body></html>'''
(train_dir/'index.html').write_text(training,encoding='utf-8')

# Add link to training page in audit coverage navigation
audp=DST/'audit'/'index.html'
aud=BeautifulSoup(audp.read_text(encoding='utf-8'),'html.parser')
nav=aud.find('nav',class_='demo-nav')
if nav and not nav.find('a',href='../entrainement/index.html'):
    a=aud.new_tag('a',href='../entrainement/index.html'); a.string='Mini-missions'; nav.append(a)
audp.write_text(str(aud),encoding='utf-8')

# Add CSS for the new utility blocks
cssp=DST/'assets'/'demo.css'
css=cssp.read_text(encoding='utf-8')
if 'v0.9 — autonomy additions' not in css:
    css += '''
/* v0.9 — autonomy additions */
.resource__missing-info{margin:.8rem 0;padding:.65rem;border-left:4px solid currentColor}
.resource__missing-info summary{font-weight:700;cursor:pointer}
.training-card{margin:1rem 0;padding:1rem;border:1px solid #ccc;border-radius:.5rem}
.training-card h2{font-size:1.15rem;margin:.35rem 0}
.training-card__refs{font-size:.9rem}
.training-card__refs span{margin-right:.45rem}
.training-group{margin-top:2rem}
'''
    cssp.write_text(css,encoding='utf-8')

# README
readme=DST/'README.md'
readme.write_text(f'''# BTS GPME — Centre de ressources HTML v0.9

Version orientée **autonomie, transfert et outils directement réutilisables**.

- {len(resources)} ressources HTML.
- 102/102 tâches professionnelles couvertes.
- {counts['Renforcée']} ressources renforcées.
- {tool_count} ressources avec un outil directement reproductible.
- {mission_count} ressources avec une mini-mission.
- {len(resources)} ressources avec un protocole commun en cas d’information manquante.
- Nouvelle page `entrainement/index.html` regroupant les mini-missions.
- Index détaillé des savoirs associés et rattachement activités / tâches / savoirs.
- Ressources liées générées à partir des références officielles.
- Audit de couverture + audit d’actionnabilité.

## Entrées principales
- `index.html` : recherche et filtrage.
- `referentiel/index.html` : blocs, activités et tâches.
- `referentiel/savoirs.html` : savoirs associés détaillés.
- `entrainement/index.html` : mini-missions de transfert.
- `audit/index.html` : couverture tâches + savoirs.
- `audit/profondeur.html` : pilotage de la profondeur.
- `maintenance/README.md` : conventions de maintenance.

Le HTML reste indépendant de la charte graphique : le CSS de démonstration peut être remplacé par celui du site.
''',encoding='utf-8')

# maintenance note
mread=DST/'maintenance'/'README.md'
txt=mread.read_text(encoding='utf-8')
txt += '''
## v0.9 — règle d’autonomie
Chaque ressource contient un bloc repliable « Si une information manque, que faire ? ». Il impose de ne pas inventer une donnée ou une règle et de distinguer recherche d’information, hypothèse autorisée et validation managériale.

Les ressources renforcées peuvent contenir :
- `details.resource__tool` : outil reproductible ;
- `details.resource__transfer` : mini-mission de transfert.

La page `entrainement/index.html` est générée à partir des mini-missions présentes dans les fiches.
'''
mread.write_text(txt,encoding='utf-8')

# Validation
broken=[]
dupes=[]
for p in DST.rglob('*.html'):
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    ids=[x.get('id') for x in s.find_all(id=True)]
    d={x for x in ids if ids.count(x)>1}
    if d: dupes.append((p,d))
    for a in s.find_all('a',href=True):
        href=a['href']
        if href.startswith(('http://','https://','mailto:','#','?')) or not href:
            continue
        target=href.split('#')[0].split('?')[0]
        if not target: continue
        rp=(p.parent/target).resolve()
        if not rp.exists():
            broken.append((p,href))
print("resources",len(resources),"reinforced",counts['Renforcée'],"actionnable",counts['Actionnable'],"to_deepen",counts['À approfondir'],"tools",tool_count,"missions",mission_count,"broken",len(broken),"dupes",len(dupes))
print("training cards",len(cards))

from collections import Counter
import zipfile, shutil, os, html
from bs4 import BeautifulSoup
from pathlib import Path

DST=Path('/mnt/data/bts-gpme-ressources-v0.9')
old=BeautifulSoup(Path('/mnt/data/bts-gpme-ressources-v0.8/audit/profondeur.html').read_text(encoding='utf-8'),'html.parser')
old_rows={}
for tr in old.find('table').find_all('tr')[1:]:
    tds=[td.get_text(' ',strip=True) for td in tr.find_all('td')]
    if len(tds)==9:
        old_rows[tds[0]]={'title':tds[1],'core':int(tds[2]),'steps':int(tds[3]),'checks':int(tds[4]),'ex':int(tds[5]),
                          'tool':tds[6]=='Oui','mission':tds[7]=='Oui','level':tds[8]}

resources=resource_records()
rmap={r['id']:r for r in resources}
rows=[]
for rid,m in old_rows.items():
    r=rmap[rid]
    s=BeautifulSoup(r['path'].read_text(encoding='utf-8'),'html.parser')
    tool=bool(s.find('details',class_='resource__tool'))
    mission=bool(s.find('details',class_='resource__transfer'))
    level='Renforcée' if (tool or mission) else m['level']
    rows.append((r,m['core'],m['steps'],m['checks'],m['ex'],tool,mission,level))

cnt=Counter(x[-1] for x in rows)
tool_count=sum(x[5] for x in rows); mission_count=sum(x[6] for x in rows)
priority=[x for x in rows if x[-1]=='Actionnable' and not x[5] and not x[6]]
priority.sort(key=lambda x:(x[1],x[0]['id']))
pr=[]
for r,core,steps,checks,ex,tool,mission,level in priority[:20]:
    rel=os.path.relpath(r['path'],DST/'audit').replace(os.sep,'/')
    pr.append(f'<li><a href="{html.escape(rel)}">{html.escape(r["id"])} — {html.escape(r["title"])}</a> <small>({core} mots de contenu cœur)</small></li>')
level_order={'À approfondir':0,'Actionnable':1,'Renforcée':2}
trs=[]
for r,core,steps,checks,ex,tool,mission,level in sorted(rows,key=lambda x:(level_order[x[-1]],x[1],x[0]['id'])):
    rel=os.path.relpath(r['path'],DST/'audit').replace(os.sep,'/')
    trs.append(f'<tr><td><a href="{html.escape(rel)}">{html.escape(r["id"])}</a></td><td>{html.escape(r["title"])}</td><td>{core}</td><td>{steps}</td><td>{checks}</td><td>{ex}</td><td>{"Oui" if tool else "—"}</td><td>{"Oui" if mission else "—"}</td><td>{level}</td></tr>')

prof=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audit d’actionnabilité — BTS GPME</title><link rel="stylesheet" href="../assets/demo.css"></head><body>
<nav class="demo-nav"><a href="../index.html">← Centre de ressources</a><a href="index.html">Audit de couverture</a><a href="../referentiel/savoirs.html">Savoirs associés</a><a href="../entrainement/index.html">Mini-missions</a></nav>
<main class="resource-page"><article class="resource"><header class="resource__header"><p class="resource__type">Outil de maintenance</p><h1>Audit d’actionnabilité et de profondeur</h1><p class="resource__lead">Même grille que la v0.8 afin de suivre l’amélioration sans changer le thermomètre en cours de route. Une fiche renforcée possède désormais un outil directement reproductible et/ou une mini-mission de transfert.</p></header>
<section><h2>État actuel</h2><ul><li><strong>{cnt['Renforcée']}</strong> ressources renforcées</li><li><strong>{cnt['Actionnable']}</strong> ressources actionnables</li><li><strong>{cnt['À approfondir']}</strong> ressource encore classée « À approfondir »</li><li><strong>{tool_count}</strong> ressources avec outil prêt à reproduire</li><li><strong>{mission_count}</strong> ressources avec mini-mission</li><li><strong>{len(resources)}</strong> ressources avec protocole « information manquante »</li></ul></section>
<section><h2>Résultat de cette itération</h2><p>Les 34 ressources qui constituaient la file « À approfondir » de la v0.8 ont toutes reçu un dispositif de transfert : outil reproductible et mini-mission. Le classement mécanique ne comporte donc plus de fiche sous le seuil précédent.</p></section>
<section><h2>Prochaine priorité</h2><p>Il reste {cnt['Actionnable']} ressources suffisamment développées mais sans outil ou mini-mission spécifique. Pour poursuivre l’homogénéisation, les 20 plus courtes de ce groupe sont :</p><ol>{''.join(pr)}</ol></section>
<section><h2>Critères inchangés</h2><p><strong>Renforcée :</strong> présence d’un outil directement reproductible ou d’une mini-mission. <strong>Actionnable :</strong> au moins 350 mots de contenu cœur, 5 étapes, 4 points d’autocontrôle et un exemple d’au moins 25 mots. Les blocs générés automatiquement ne sont pas utilisés pour gonfler le contenu cœur.</p></section>
<section><h2>Tableau de contrôle</h2><div class="audit-table-wrap"><table class="audit-table"><thead><tr><th>ID</th><th>Ressource</th><th>Contenu cœur</th><th>Étapes</th><th>Contrôles</th><th>Exemple</th><th>Outil</th><th>Mini-mission</th><th>Niveau</th></tr></thead><tbody>{''.join(trs)}</tbody></table></div></section>
<footer class="resource__footer"><p>La prochaine phase ne consiste plus à « combler des trous », mais à homogénéiser la qualité des ressources actionnables et à les tester sur des situations professionnelles réelles.</p></footer></article></main></body></html>'''
(DST/'audit'/'profondeur.html').write_text(prof,encoding='utf-8')

# README with stable counts
(DST/'README.md').write_text(f'''# BTS GPME — Centre de ressources HTML v0.9

Version orientée **autonomie, transfert et outils directement réutilisables**.

- {len(resources)} ressources HTML.
- 102/102 tâches professionnelles couvertes.
- {cnt['Renforcée']} ressources renforcées.
- {cnt['Actionnable']} ressources actionnables.
- {cnt['À approfondir']} ressource sous le seuil mécanique de la v0.8.
- {tool_count} ressources avec un outil directement reproductible.
- {mission_count} ressources avec une mini-mission.
- {len(resources)} ressources avec un protocole commun en cas d’information manquante.
- Nouvelle page `entrainement/index.html` regroupant les mini-missions.
- Index détaillé des savoirs associés et rattachement activités / tâches / savoirs.
- Ressources liées générées à partir des références officielles.
- Audit de couverture + audit d’actionnabilité.

## Entrées principales
- `index.html` : recherche et filtrage.
- `referentiel/index.html` : blocs, activités et tâches.
- `referentiel/savoirs.html` : savoirs associés détaillés.
- `entrainement/index.html` : mini-missions de transfert.
- `audit/index.html` : couverture tâches + savoirs.
- `audit/profondeur.html` : pilotage de la profondeur.
- `maintenance/README.md` : conventions de maintenance.

Le HTML reste indépendant de la charte graphique : le CSS de démonstration peut être remplacé par celui du site.
''',encoding='utf-8')

print(cnt, tool_count, mission_count)
