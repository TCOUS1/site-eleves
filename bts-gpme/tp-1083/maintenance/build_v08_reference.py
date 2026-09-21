from pathlib import Path
from bs4 import BeautifulSoup
from html import escape
import shutil, json, re, zipfile, os, unicodedata

SRC=Path('/mnt/data/bts-gpme-ressources-v0.7')
DST=Path('/mnt/data/bts-gpme-ressources-v0.8')
if DST.exists(): shutil.rmtree(DST)
shutil.copytree(SRC,DST)

# ---------- Official associated knowledge map (referential 2018) ----------
# A code can intentionally have several labels when the published referential reuses the same code.
KNOWLEDGE = {
'S1_1_1':['L’identification de la clientèle'],
'S1_1_2':['La prospection et la qualification des prospects'],
'S1_1_3':['Les appels d’offres'],
'S1_2_1':['Le système d’information client'],
'S1_2_2':['Les documents commerciaux, les contrats, l’établissement des factures'],
'S1_2_3':['Le suivi des commandes clients – la traçabilité du produit'],
'S1_2_4':['Les risques d’insolvabilité'],
'S1_2_5':['Les principes de base du modèle comptable, les comptes, comptes de tiers et balance'],
'S1_3_1':['L’accueil'],
'S1_3_2':['Les réclamations'],
'S1_4_1':['Typologie des achats et investissements'],
# Published referential repeats S1.4.2 for the next two labels. Do not silently invent S1.4.3.
'S1_4_2':['Référencement des fournisseurs','Système d’information fournisseur'],
'S1_5_1':['Processus d’achat et d’investissement, les commandes fournisseurs'],
'S1_5_2':['Principes généraux de la gestion des stocks'],
'S1_6_1':['Principes comptables'],
'S1_6_2':['Principes et règles de calcul de la TVA'],
'S1_6_3':['Suivi des encaissements et décaissements'],
'S1_7':['Fonctionnalités du PGI et d’outils bureautiques et numériques'],
'S1_7_1':['Fonctionnalités du PGI et d’outils bureautiques et numériques dans le cadre du suivi comptable'],

'S2_1_1':['Méthodologie de la veille'],
'S2_1_2':['Droit de la propriété intellectuelle'],
'S2_2':['Méthodologie de la conduite de projet'],
'S2_3':['La gestion des risques'],
'S2_4':['Analyse des risques de trésorerie'],
'S2_5_1':['La protection des salariés en matière d’hygiène et sécurité, de poste de travail et l’amélioration des conditions de travail'],
'S2_5_1_1':['La protection des salariés en matière d’hygiène et sécurité'],
'S2_5_1_2':['La protection des salariés par l’amélioration des conditions de travail'],
'S2_5_2':['La prévention des risques professionnels'],
'S2_5_3':['La protection des personnes, des biens et des données'],
'S2_5_3_1':['La protection des personnes, des biens'],
'S2_5_3_2':['Protection des droits de propriété intellectuelle : règles juridiques et procédures de dépôt'],
'S2_5_3_3':['La protection des données'],
'S2_5_4':['La gestion des risques environnementaux'],
'S2_5_5':['La gestion des risques informatiques'],
'S2_5_5_1':['La notion de système d’information'],
'S2_5_5_2':['Notion de système informatique'],
'S2_5_5_3':['Les enjeux de la sécurité informatique et l’importance d’une évaluation'],
'S2_5_5_4':['La prise en charge des risques informatiques'],
'S2_5_5_5':['Les axes majeurs de la sécurité informatique'],
'S2_6_1':['La démarche qualité'],
'S2_6_2':['La gestion des connaissances'],
'S2_6_3':['Les normes et la certification'],
'S2_7':['Fonctionnalités du PGI et d’outils bureautiques et numériques'],
'S2_7_1':['Fonctionnalités du PGI et d’outils bureautiques et numériques dans le cadre de la gestion des risques financiers'],

'S3_1_1':['Les sources du droit social'],
'S3_1_2':['Les formalités d’embauche et de départ, le contrat de travail'],
'S3_1_3':['Les dossiers du personnel'],
'S3_1_4':['Les absences et congés du personnel'],
'S3_1_5':['La paie'],
'S3_1_6':['La représentation des salariés'],
'S3_2_1':['Le recrutement'],
'S3_2_2':['L’intégration des nouveaux membres'],
'S3_2_3':['La formation'],
'S3_2_4':['L’évaluation'],
'S3_2_5':['Le tableau de bord social'],
'S3_3':['Le travail collaboratif'],
'S3_4':['Fonctionnalités du PGI et d’outils bureautiques et numériques dans le cadre de la gestion du personnel et des ressources humaines'],

'S4_1_1':['Le système d’information et sa représentation'],
'S4_1_2':['Les bases de données'],
'S4_1_3':['La gestion de l’archivage des documents'],
'S4_1_4':['Les ressources, leur localisation et leurs rôles au sein du SI, leurs droits d’accès et les services de sécurité'],
'S4_2_1':['La méthodologie de résolution de problème'],
'S4_2_2':['L’organisation des activités'],
'S4_2_3':['La gestion du temps'],
'S4_3_1':['Le marché de l’entreprise'],
'S4_3_2':['La stratégie commerciale et sa mise en œuvre'],
'S4_3_3':['Les techniques de fidélisation'],
'S4_4_1':['Communication globale et identité de l’entreprise'],
'S4_4_2':['La communication institutionnelle'],
'S4_4_3':['La communication commerciale'],
'S4_4_4':['La communication digitale'],
'S4_5_1':['La performance'],
'S4_5_2':['Calcul et analyse des coûts et des résultats'],
'S4_5_3':['Le seuil de rentabilité'],
'S4_5_4':['La démarche budgétaire'],
'S4_6_1':['L’analyse financière de l’entreprise'],
'S4_6_2':['Le plan de financement'],
'S4_6_3':['Les modes de financement des investissements'],
'S4_7_1':['Le tableau de bord'],
'S4_8':['Fonctionnalités d’outils bureautiques et numériques'],
'S4_8_1':['Fonctionnalités du PGI et d’outils bureautiques et numériques'],

'S5_1':['Enjeux et concepts de base de communication'],
'S5_2':['Communication écrite opérationnelle'],
'S5_3':['La modélisation des documents et l’interface homme-machine'],
'S5_4':['La communication numérique écrite'],
'S5_5':['La communication orale interpersonnelle'],
'S5_6':['La communication dans les groupes'],
'S5_7':['La gestion des conflits'],
'S5_8':['Les instruments de dialogue'],
}

ACTIVITY_KNOWLEDGE = {
'A1_1':['S1_1_1','S1_1_2','S1_1_3','S1_7','S5_1','S5_2','S5_3'],
'A1_2':['S1_2_1','S1_2_2','S1_2_3','S1_2_4','S1_2_5','S1_7','S5_1','S5_2','S5_3','S5_5'],
'A1_3':['S1_3_1','S1_3_2','S1_7','S5_1','S5_2','S5_4','S5_5','S5_7'],
'A1_4':['S1_4_1','S1_4_2','S1_7','S5_1','S5_2','S5_5'],
'A1_5':['S1_5_1','S1_2_2','S1_5_2','S1_7','S5_1','S5_2','S5_5'],
'A1_6':['S1_6_1','S1_6_2','S1_6_3','S1_7_1','S5_1','S5_2','S5_5'],
'A2_1':['S2_1_1','S2_1_2','S5_1','S5_2','S5_4','S5_5'],
'A2_2':['S2_2','S2_7','S5_1','S5_2','S5_3','S5_5','S5_6'],
'A2_3':['S2_3','S2_7','S5_1','S5_2','S5_5','S5_6'],
'A2_4':['S2_4','S2_7_1','S5_1','S5_2'],
'A2_5':['S2_5_1','S2_5_1_1','S2_5_1_2','S2_5_2','S2_5_3','S2_5_3_1','S2_5_3_2','S2_5_3_3','S2_5_4','S2_5_5','S2_7','S5_1','S5_2','S5_4','S5_5','S5_6'],
'A2_6':['S2_6_1','S2_6_2','S2_6_3','S2_7','S5_1','S5_2','S5_3','S5_4','S5_5','S5_6'],
'A3_1':['S3_1_1','S3_1_2','S3_1_3','S3_1_4','S3_1_5','S3_1_6','S3_4','S5_1','S5_2','S5_3','S5_4','S5_5','S5_6'],
'A3_2':['S3_2_1','S3_2_2','S3_2_3','S3_2_4','S3_2_5','S3_4','S5_1','S5_2','S5_3','S5_4','S5_5','S5_6'],
'A3_3':['S3_3','S5_1','S5_2','S5_3','S5_4','S5_5','S5_6','S5_7','S5_8'],
'A4_1':['S4_1_1','S4_1_2','S4_1_3','S4_1_4','S5_1','S5_2'],
'A4_2':['S4_2_1','S4_2_2','S4_2_3','S4_8','S5_1','S5_2','S5_4','S5_5','S5_6'],
'A4_3':['S4_3_1','S4_3_2','S4_3_3','S4_8_1','S5_1','S5_2'],
'A4_4':['S4_4_1','S4_4_2','S4_4_3','S4_4_4','S4_8_1','S5_1','S5_2','S5_4'],
'A4_5':['S4_5_1','S4_5_2','S4_5_3','S4_5_4','S4_8_1','S5_2'],
'A4_6':['S4_6_1','S4_6_2','S4_6_3','S4_8_1','S5_2'],
'A4_7':['S4_7_1','S4_8','S5_2'],
}

# ---------- generic helpers ----------
def slug_ref(ref): return ref.lower().replace('_','-')
def text_words(el):
    if not el: return 0
    return len(re.findall(r"\b[\wÀ-ÿ'-]+\b", ' '.join(el.stripped_strings)))
def canonical_type(label):
    n=unicodedata.normalize('NFD', label.lower())
    n=''.join(c for c in n if unicodedata.category(c)!='Mn')
    if 'regle' in n or 'reglement' in n: return 'regle'
    if n.strip().startswith('outil'): return 'outil'
    if 'repere' in n or 'savoir' in n: return 'repere'
    return 'methode'

def resource_files(): return sorted(DST.joinpath('ressources').rglob('*.html'))

def parse_resources():
    out=[]
    for p in resource_files():
        soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
        art=soup.find('article', class_='resource')
        if not art: continue
        out.append({
            'path':p,
            'id':art.get('data-resource-id',''),
            'title':soup.find('h1').get_text(' ',strip=True),
            'type_label':(soup.find(class_='resource__type').get_text(' ',strip=True) if soup.find(class_='resource__type') else ''),
            'bc':art.get('data-bc',''),
            'activities':art.get('data-activities','').split(),
            'tasks':art.get('data-tasks','').split(),
            'knowledge':art.get('data-knowledge','').split(),
            'maintenance':art.get('data-maintenance','stable'),
            'verified':art.get('data-verified',''),
            'soup':soup,
        })
    return out

# ---------- fix official code fidelity + normalize metadata ----------
for p in resource_files():
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    art=soup.find('article',class_='resource')
    if not art: continue
    # A2.4 specifically cites S2.7.1 in the official referential.
    if 'A2_4' in art.get('data-activities','').split():
        know=art.get('data-knowledge','').split()
        know=['S2_7_1' if x=='S2_7' else x for x in know]
        # preserve order, dedupe
        know=list(dict.fromkeys(know))
        art['data-knowledge']=' '.join(know)
        for a in soup.select('.resource__referential-tags a[data-ref="S2_7"]'):
            a['data-ref']='S2_7_1'; a['href']=a['href'].replace('S2_7','S2_7_1'); a.string='#S2_7_1'
    # normalize technical type without losing visible nuance
    old=art.get('data-resource-type','')
    label=soup.find(class_='resource__type').get_text(' ',strip=True) if soup.find(class_='resource__type') else old
    art['data-resource-format']=old
    art['data-resource-type']=canonical_type(label)
    p.write_text(str(soup),encoding='utf-8')

resources=parse_resources()
by_id={r['id']:r for r in resources}

# ---------- add detailed referential links and automatic related resources ----------
generic_knowledge={'S5_1','S5_2','S5_3','S5_4','S5_5','S5_6','S5_7','S5_8','S1_7','S1_7_1','S2_7','S2_7_1','S3_4','S4_8','S4_8_1'}

def rel_href(from_path,to_path): return os.path.relpath(to_path, from_path.parent).replace(os.sep,'/')

def score_related(a,b):
    st=set(a['tasks']) & set(b['tasks'])
    sa=set(a['activities']) & set(b['activities'])
    sk=(set(a['knowledge'])-generic_knowledge) & (set(b['knowledge'])-generic_knowledge)
    sg=set(a['knowledge']) & set(b['knowledge'])
    score=10*len(st)+4*len(sa)+3*len(sk)+0.5*len(sg)+(1 if a['bc'] and a['bc']==b['bc'] else 0)
    return score,st,sa,sk,sg

for r in resources:
    p=r['path']; soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser'); art=soup.find('article',class_='resource')
    header=soup.find('header',class_='resource__header')
    # Detailed referential block
    existing=soup.find('details',class_='resource__referential-detail')
    if existing: existing.decompose()
    details=soup.new_tag('details'); details['class']='resource__referential-detail'
    summary=soup.new_tag('summary'); summary.string='Rattachement détaillé au référentiel'; details.append(summary)
    dl=soup.new_tag('dl')
    if r['activities']:
        dt=soup.new_tag('dt'); dt.string='Activité(s)'; dl.append(dt)
        dd=soup.new_tag('dd')
        for i,x in enumerate(r['activities']):
            if i: dd.append(' · ')
            a=soup.new_tag('a',href=f"../../referentiel/index.html#{slug_ref(x)}"); a.string=f'#{x}'; dd.append(a)
        dl.append(dd)
    if r['tasks']:
        dt=soup.new_tag('dt'); dt.string='Tâche(s)'; dl.append(dt)
        dd=soup.new_tag('dd')
        for i,x in enumerate(r['tasks']):
            if i: dd.append(' · ')
            a=soup.new_tag('a',href=f"../../referentiel/index.html#{slug_ref(x)}"); a.string=f'#{x}'; dd.append(a)
        dl.append(dd)
    if r['knowledge']:
        dt=soup.new_tag('dt'); dt.string='Savoir(s) associé(s)'; dl.append(dt)
        dd=soup.new_tag('dd')
        for i,x in enumerate(r['knowledge']):
            if i: dd.append(' · ')
            a=soup.new_tag('a',href=f"../../referentiel/savoirs.html#{slug_ref(x)}"); a.string=f'#{x}'; dd.append(a)
        dl.append(dd)
    details.append(dl); header.append(details)

    # related resources generated from official refs
    old=soup.find('section',class_='resource__related')
    if old: old.decompose()
    candidates=[]
    for b in resources:
        if b['id']==r['id']: continue
        sc,st,sa,sk,sg=score_related(r,b)
        if sc>0: candidates.append((sc,b,st,sa,sk,sg))
    candidates.sort(key=lambda x:(-x[0],x[1]['id']))
    chosen=candidates[:4]
    sec=soup.new_tag('section'); sec['class']='resource__related'
    h=soup.new_tag('h2'); h.string='Ressources liées'; sec.append(h)
    intro=soup.new_tag('p'); intro.string='Suggestions générées à partir des rattachements communs au référentiel.'; sec.append(intro)
    ul=soup.new_tag('ul')
    for sc,b,st,sa,sk,sg in chosen:
        li=soup.new_tag('li')
        a=soup.new_tag('a',href=rel_href(p,b['path'])); a.string=f"{b['id']} — {b['title']}"; li.append(a)
        reasons=[]
        if st: reasons.append('même tâche '+', '.join('#'+x for x in sorted(st)))
        elif sk: reasons.append('savoir associé commun '+', '.join('#'+x for x in sorted(sk)))
        elif sa: reasons.append('même activité '+', '.join('#'+x for x in sorted(sa)))
        elif sg: reasons.append('savoir transversal commun '+', '.join('#'+x for x in sorted(sg)))
        if reasons:
            small=soup.new_tag('small'); small.string=' — '+reasons[0]; li.append(small)
        ul.append(li)
    sec.append(ul)
    footer=soup.find('footer',class_='resource__footer')
    footer.insert_before(sec)
    p.write_text(str(soup),encoding='utf-8')

# refresh resources after changes
resources=parse_resources(); by_id={r['id']:r for r in resources}

# ---------- deepen selected high-use resources with reproducible tools ----------
TOOLS={
'R-B1-002':('Grille minimale de qualification d’un prospect', ['Identifiant','Raison sociale','Secteur','Taille/critère cible','Besoin probable','Source','Coordonnées vérifiées','Priorité','Dernière action','Prochaine action']),
'R-B1-005':('Trame de contrôle d’une proposition commerciale', ['Besoin client','Produit/service proposé','Quantité','Prix','Remise autorisée','Délai','Validité de l’offre','Conditions de règlement','Référence CGV','Validation interne']),
'R-B1-014':('Tableau de suivi des réclamations', ['N°','Client','Commande','Date','Motif','Impact','Cause vérifiée','Action immédiate','Responsable','Échéance','Statut','Clôture']),
'R-B1-017':('Matrice de comparaison des offres fournisseurs', ['Critère','Pondération','Offre A','Offre B','Offre C','Justification / source']),
'R-B1-023':('Grille d’évaluation d’un fournisseur', ['Critère','Indicateur','Cible','Résultat période','Écart','Appréciation','Action proposée']),
'R-B1-025':('Structure d’un rapprochement bancaire', ['Date','Libellé','Montant relevé banque','Montant comptabilité','Écart','Explication','Écriture / action à prévoir']),
'R-B2-001':('Registre d’évaluation des risques', ['Risque formulé','Cause','Événement redouté','Conséquence','Probabilité','Gravité','Niveau / criticité','Mesures existantes','Action proposée','Responsable','Échéance']),
'R-B2-008':('Tableau des exigences d’un cahier des charges', ['Besoin / exigence','Critère de réussite','Priorité','Responsable','Contrainte','Preuve attendue','Validation']),
'R-B2-010':('Tableau de suivi d’un projet', ['Action','Responsable','Début','Échéance','Statut','Avancement','Écart','Risque / blocage','Décision / action']),
'R-B2-014':('Budget de trésorerie à construire dans le tableur', ['Rubrique','Mois 1','Mois 2','Mois 3','Mois 4','Mois 5','Mois 6']),
'R-B2-024':('Fiche d’analyse d’un dysfonctionnement', ['Fait observé','Date / lieu','Processus','Exigence attendue','Écart','Conséquence','Cause probable','Preuve','Action immédiate','Action corrective','Suivi']),
'R-B2-025':('Squelette d’une procédure opérationnelle', ['Rubrique','Contenu attendu']),
'R-B3-008':('Collecte mensuelle des variables de paie', ['Salarié','Période','Heures / absences','Prime / commission','Avantage / retenue','Justificatif','Source','Contrôle effectué','Validation']),
'R-B3-013':('Trame de fiche de poste', ['Rubrique','Éléments à renseigner']),
'R-B3-015':('Grille de présélection des candidatures', ['Critère objectif','Indispensable ?','Pondération','Candidat A','Candidat B','Candidat C','Preuve dans le dossier']),
'R-B3-017':('Checklist d’intégration', ['Étape','Avant arrivée','Jour J','Semaine 1','Mois 1','Responsable','Preuve / statut']),
'R-B3-023':('Tableau de définition des indicateurs sociaux', ['Indicateur','Question de gestion','Formule','Source','Périodicité','Seuil / référence','Responsable','Commentaire']),
'R-B3-026':('Matrice d’organisation du travail collaboratif', ['Livrable / action','Responsable','Contributeurs','Délai','Espace / fichier de référence','Règle de nommage','Validation','Statut']),
'R-B4-007':('Grille d’analyse d’un processus support', ['Étape','Entrée','Acteur','Action','Outil / SI','Sortie','Contrôle','Délai','Dysfonctionnement','Amélioration']),
'R-B4-009':('Tableau de planification opérationnelle', ['Activité / intervention','Client / lieu','Durée','Ressource','Prérequis','Début','Fin','Contrainte','Statut','Alerte']),
'R-B4-015':('Grille d’analyse d’une tendance de marché', ['Signal observé','Source','Date','Données de confirmation','Tendance ou signal isolé ?','Impact possible PME','Niveau de confiance','Action / veille suivante']),
'R-B4-016':('Plan de conception d’une enquête', ['Information recherchée','Question','Type de réponse','Population ciblée','Biais à éviter','Traitement prévu']),
'R-B4-025':('Tableau de calcul d’un coût complet', ['Élément de coût','Nature','Montant','Clé / unité d’œuvre','Affectation / imputation','Contrôle']),
'R-B4-027':('Trame de calcul du seuil de rentabilité', ['Donnée / étape','Valeur','Formule / contrôle']),
'R-B4-030':('Tableau de passage du bilan comptable au bilan fonctionnel', ['Poste source','Montant','Retraitement','Emploi / ressource fonctionnelle','Montant reclassé','Contrôle']),
'R-B4-035':('Fiche de définition d’un indicateur', ['Nom','Question de pilotage','Formule','Source','Périodicité','Objectif / seuil','Sens de variation','Responsable','Action si alerte']),
'R-B4-036':('Structure d’un tableau de bord exploitable', ['Indicateur','Réalisé','Objectif / référence','Écart','Évolution','Alerte','Explication vérifiée','Action / décision attendue']),
}

MINI={
'R-B1-014':('Mini-mission', 'Un client signale 12 articles manquants sur 80 et menace de bloquer le paiement de toute la facture. Identifiez les pièces à vérifier, les faits à tracer et ce que vous pouvez proposer sans engager la PME au-delà de vos consignes.'),
'R-B1-017':('Mini-mission', 'Trois fournisseurs proposent des prix proches mais des délais, garanties et conditions de règlement différents. Construisez une comparaison dont le dirigeant peut comprendre le classement sans relire les trois devis.'),
'R-B2-001':('Mini-mission', 'Vous avez recensé huit risques. Deux sont fréquents mais peu graves, un est rare mais pourrait arrêter l’activité. Définissez une échelle commune, évaluez sans modifier les critères en cours de route et préparez l’alerte.'),
'R-B2-014':('Mini-mission', 'Le budget montre une trésorerie négative au mois 4 à cause d’un investissement et d’un retard d’encaissement. Testez au moins deux scénarios et distinguez clairement les hypothèses des décisions déjà validées.'),
'R-B2-024':('Mini-mission', 'Les retards de livraison ont doublé en trois mois. À partir des dossiers clients, séparez symptômes, faits, causes possibles et causes prouvées, puis proposez une action mesurable.'),
'R-B3-013':('Mini-mission', 'Le dirigeant souhaite recruter “quelqu’un de polyvalent et dynamique”. Transformez cette demande en missions, responsabilités et critères observables utilisables ensuite pour rédiger l’annonce et sélectionner les candidatures.'),
'R-B3-015':('Mini-mission', 'Quatre CV présentent des parcours très différents. Construisez une grille à partir de la fiche de poste avant de lire les candidatures, puis justifiez chaque appréciation par une preuve du dossier.'),
'R-B3-023':('Mini-mission', 'L’absentéisme augmente mais l’effectif a aussi progressé. Choisissez un indicateur comparable dans le temps, contrôlez son dénominateur et proposez deux ventilations permettant d’éviter une conclusion trop rapide.'),
'R-B4-007':('Mini-mission', 'Une demande d’achat passe par trois courriels, un tableau partagé et une ressaisie dans le PGI. Représentez le flux actuel, repérez les doubles saisies et proposez une amélioration sans supprimer un contrôle utile.'),
'R-B4-015':('Mini-mission', 'Un concurrent annonce une nouvelle offre et deux clients posent la même question la semaine suivante. Montrez ce qu’il faudrait rechercher avant de conclure à une tendance de marché.'),
'R-B4-025':('Mini-mission', 'Une commande paraît rentable si l’on ne retient que les achats directs. Reconstituez le coût avec la méthode fournie par la PME et expliquez quelles charges changent réellement la décision.'),
'R-B4-036':('Mini-mission', 'Le dirigeant demande “un tableau de bord de tout ce qui se passe”. Ramenez la demande à cinq ou six indicateurs reliés à de vraies questions de pilotage et prévoyez une alerte pour chacun.'),
}

def make_table(soup, cols):
    wrap=soup.new_tag('div'); wrap['class']='resource__tool-table-wrap'
    table=soup.new_tag('table'); table['class']='resource__tool-table'
    thead=soup.new_tag('thead'); tr=soup.new_tag('tr')
    for c in cols:
        th=soup.new_tag('th'); th.string=c; tr.append(th)
    thead.append(tr); table.append(thead)
    tbody=soup.new_tag('tbody')
    for _ in range(3):
        tr=soup.new_tag('tr')
        for _ in cols:
            td=soup.new_tag('td'); td.string=''; tr.append(td)
        tbody.append(tr)
    table.append(tbody); wrap.append(table); return wrap

for rid,(title,cols) in TOOLS.items():
    r=by_id.get(rid)
    if not r: continue
    p=r['path']; soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    old=soup.find('details',class_='resource__tool')
    if old: old.decompose()
    d=soup.new_tag('details'); d['class']='resource__tool'; d['open']=''
    sm=soup.new_tag('summary'); sm.string='Outil prêt à reproduire'; d.append(sm)
    h=soup.new_tag('h3'); h.string=title; d.append(h)
    ptxt=soup.new_tag('p'); ptxt.string='Reproduisez cette structure dans votre tableur, PGI ou document de travail puis adaptez uniquement les colonnes justifiées par la situation professionnelle.'; d.append(ptxt)
    d.append(make_table(soup,cols))
    err=soup.find('details',class_='resource__errors')
    err.insert_before(d)
    p.write_text(str(soup),encoding='utf-8')

for rid,(label,scenario) in MINI.items():
    r=by_id.get(rid)
    if not r: continue
    p=r['path']; soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    old=soup.find('details',class_='resource__transfer')
    if old: old.decompose()
    d=soup.new_tag('details'); d['class']='resource__transfer'
    sm=soup.new_tag('summary'); sm.string=label; d.append(sm)
    pp=soup.new_tag('p'); pp.string=scenario; d.append(pp)
    ul=soup.new_tag('ul')
    for x in ['Quel résultat professionnel devez-vous produire ?','Quelles informations vous manquent avant d’agir ?','Quelle partie pouvez-vous traiter seul et quelle partie doit être validée ?']:
        li=soup.new_tag('li'); li.string=x; ul.append(li)
    d.append(ul)
    er=soup.find('details',class_='resource__errors'); er.insert_before(d)
    p.write_text(str(soup),encoding='utf-8')

resources=parse_resources(); by_id={r['id']:r for r in resources}

# ---------- build detailed associated knowledge page ----------
# count actual use in resource metadata
counts={k:0 for k in KNOWLEDGE}
links={k:[] for k in KNOWLEDGE}
for r in resources:
    for k in r['knowledge']:
        counts.setdefault(k,0); links.setdefault(k,[])
        counts[k]+=1; links[k].append(r)

def sort_code(k):
    parts=[]
    for x in k[1:].split('_'):
        try: parts.append(int(x))
        except: parts.append(999)
    return parts

sections=[]
for block in ['S1','S2','S3','S4','S5']:
    lis=[]
    for code in sorted([k for k in KNOWLEDGE if k.startswith(block+'_')], key=sort_code):
        labels=KNOWLEDGE[code]
        label_html='<br>'.join(escape(x) for x in labels)
        note=''
        if code=='S1_4_2': note='<p class="referential-note"><strong>Attention :</strong> le référentiel publié attribue le même code S.1.4.2 à « Référencement des fournisseurs » et à « Système d’information fournisseur ». La bibliothèque conserve cette numérotation au lieu d’inventer un code.</p>'
        if code in ('S2_7_1','S1_7_1','S4_8_1'):
            note+='<p class="referential-note">Cette variante de numérotation apparaît telle quelle dans l’activité concernée du référentiel publié.</p>'
        reslinks=''
        if links.get(code):
            items=[]
            for r in links[code][:8]:
                rel=os.path.relpath(r['path'], DST/'referentiel').replace(os.sep,'/')
                items.append(f'<li><a href="{rel}">{escape(r["id"])} — {escape(r["title"])}</a></li>')
            more=f'<p>{counts[code]} ressource(s) rattachée(s).</p>'
            reslinks=more+'<ul>'+''.join(items)+'</ul>'
        else:
            reslinks='<p>Aucune ressource ne porte directement ce code ; il peut s’agir d’un niveau parent ou d’un point encore à contrôler.</p>'
        lis.append(f'<article class="referential-knowledge" id="{slug_ref(code)}" data-ref="{code}"><h3>#{code} — {label_html}</h3>{note}{reslinks}</article>')
    sections.append(f'<section class="referential-block"><h2>{block.replace("S", "Savoirs S")}</h2>'+''.join(lis)+'</section>')

sav_html=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Savoirs associés — Référentiel BTS GPME</title><link rel="stylesheet" href="../assets/demo.css"></head><body><nav class="demo-nav"><a href="../index.html">← Centre de ressources</a><a href="index.html">Activités et tâches</a><a href="../audit/index.html">Audit</a></nav><main class="resource-page"><article class="resource"><header class="resource__header"><p class="resource__type">Référentiel officiel — index technique</p><h1>Savoirs associés du BTS GPME</h1><p class="resource__lead">Index des codes utilisés pour rattacher les ressources aux savoirs associés. Les libellés et les particularités de numérotation sont conservés au plus près du référentiel publié.</p></header>{''.join(sections)}<footer class="resource__footer"><p>Source normative : référentiel BTS Gestion de la PME, arrêté publié au Journal officiel du 6 mars 2018.</p></footer></article></main></body></html>'''
(DST/'referentiel'/'savoirs.html').write_text(sav_html,encoding='utf-8')

# ---------- enrich main referential with linked associated knowledge per activity ----------
refp=DST/'referentiel'/'index.html'
soup=BeautifulSoup(refp.read_text(encoding='utf-8'),'html.parser')
# add nav link
nav=soup.find('nav',class_='demo-nav')
if nav and not nav.find('a',href='savoirs.html'):
    a=soup.new_tag('a',href='savoirs.html'); a.string='Savoirs associés'; nav.append(a)
for act,codes in ACTIVITY_KNOWLEDGE.items():
    sec=soup.find(id=slug_ref(act))
    if not sec: continue
    old=sec.find('p',class_='referential-knowledge-links')
    if old: old.decompose()
    p=soup.new_tag('p'); p['class']='referential-knowledge-links'
    strong=soup.new_tag('strong'); strong.string='Savoirs associés : '; p.append(strong)
    for i,k in enumerate(codes):
        if i: p.append(' · ')
        a=soup.new_tag('a',href=f'savoirs.html#{slug_ref(k)}'); a.string=f'#{k}'; p.append(a)
    # place after activity heading
    h=sec.find(['h2','h3'])
    if h: h.insert_after(p)
refp.write_text(str(soup),encoding='utf-8')

# ---------- rebuild resource index ----------
resources=parse_resources()
index=[]
for r in resources:
    art=r['soup'].find('article',class_='resource')
    rel=r['path'].relative_to(DST).as_posix()
    index.append({'id':r['id'],'title':r['title'],'url':rel,'type':r['type_label'],'type_key':art.get('data-resource-type',''),'format':art.get('data-resource-format',''),'bc':r['bc'],'activities':r['activities'],'tasks':r['tasks'],'knowledge':r['knowledge'],'maintenance':r['maintenance'],'verified':r['verified']})
(DST/'resources-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2),encoding='utf-8')

# ---------- rebuild center cards from resources, with canonical type filter ----------
# reuse current index grouping titles from existing page
idxp=DST/'index.html'; old=BeautifulSoup(idxp.read_text(encoding='utf-8'),'html.parser')
group_titles={g.get('data-resource-group'):g.find('h3').get_text(' ',strip=True) for g in old.select('.resource-group') if g.get('data-resource-group') and g.find('h3')}
# classify transversals separately
def group_for(r): return r['activities'][0] if r['activities'] else 'TRANSVERSAL'
order=[]
for r in resources:
    g=group_for(r)
    if g not in order: order.append(g)
# counts
bc_counts={b:sum(1 for r in resources if r['bc']==b) for b in ['BC1','BC2','BC3','BC4']}
trans=sum(1 for r in resources if not r['bc'])

def card(r):
    soup=BeautifulSoup(r['path'].read_text(encoding='utf-8'),'html.parser')
    art=soup.find('article',class_='resource'); lead=soup.find('section',class_='resource__outcome')
    outcome=' '.join(list(lead.stripped_strings)[1:]) if lead else ''
    refs=[]
    for x in (r['activities']+r['tasks']+r['knowledge']):
        if x not in refs: refs.append(x)
    if r['bc']: refs.insert(0,r['bc'])
    tags=''.join(f'<a href="?tag={escape(x)}">#{escape(x)}</a>' for x in refs)
    search=' '.join(soup.stripped_strings)
    url=r['path'].relative_to(DST).as_posix()
    type_key=art.get('data-resource-type','methode')
    return f'<article class="resource-card" data-resource-id="{escape(r["id"])}" data-type="{type_key}" data-refs="{escape(" ".join(refs))}" data-search="{escape(search)}"><p class="resource-card__type">{escape(r["type_label"])}</p><h3><a href="{url}">{escape(r["title"])}</a></h3><p>{escape(outcome)}</p><nav class="resource-card__tags" aria-label="Rattachement au référentiel">{tags}</nav></article>'

groups=[]
for g in order:
    rs=[r for r in resources if group_for(r)==g]
    title=group_titles.get(g, 'Ressources transversales' if g=='TRANSVERSAL' else g)
    groups.append(f'<section class="resource-group" data-resource-group="{g}" aria-labelledby="group-{g.lower().replace("_","-")}"><h3 id="group-{g.lower().replace("_","-")}">{escape(title)}</h3><div class="resource-results__list">{"".join(card(r) for r in rs)}</div></section>')

center=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Centre de ressources — BTS GPME</title><link rel="stylesheet" href="assets/demo.css"><script src="assets/search.js" defer></script></head><body><main class="resource-center" id="resource-center"><header class="resource-center__header"><p class="resource-center__eyebrow">Bibliothèque de ressources professionnelles — BC1 à BC4 + transversal</p><h1>Centre de ressources — BTS GPME</h1><p>Recherchez avec vos mots ou cliquez sur un hashtag du référentiel. Les hashtags correspondent uniquement à des références officielles ; la recherche en langage naturel sert à retrouver le besoin professionnel.</p><p><strong>{len(resources)} ressources :</strong> BC1 {bc_counts['BC1']} · BC2 {bc_counts['BC2']} · BC3 {bc_counts['BC3']} · BC4 {bc_counts['BC4']} · transversales {trans}.</p></header><section class="resource-search" aria-labelledby="search-title"><h2 id="search-title">Que devez-vous faire ?</h2><form id="resource-search-form" role="search"><label for="resource-search-input">Recherche</label><div class="resource-search__row"><input id="resource-search-input" name="q" type="search" placeholder="Ex. comparer fournisseurs, tableau de bord, réclamation, TCD…" autocomplete="off"><select id="resource-type-filter" aria-label="Type de ressource"><option value="">Tous les types</option><option value="methode">Méthodes</option><option value="outil">Outils</option><option value="repere">Repères / savoirs</option><option value="regle">Règles / réglementation</option></select><button type="submit">Rechercher</button><button type="button" id="resource-search-reset">Tout afficher</button></div></form><div class="resource-search__active" id="active-filter" hidden><span>Filtre référentiel :</span> <strong id="active-filter-value"></strong> <button type="button" id="clear-tag-filter">Supprimer le filtre</button></div><nav class="resource-search__examples" aria-label="Exemples de filtres référentiels"><a href="?tag=BC1">#BC1</a><a href="?tag=BC2">#BC2</a><a href="?tag=BC3">#BC3</a><a href="?tag=BC4">#BC4</a><a href="?tag=S5_2">#S5_2</a><a href="?tag=S2_7">#S2_7</a></nav></section><section class="resource-results" aria-labelledby="results-title"><header class="resource-results__header"><h2 id="results-title">Ressources disponibles</h2><p id="results-count" aria-live="polite"></p></header>{''.join(groups)}<p id="no-results" hidden>Aucune ressource ne correspond à cette recherche.</p></section><nav class="resource-center__footer-nav" aria-label="Outils de la bibliothèque"><a href="referentiel/index.html">Activités et tâches</a> · <a href="referentiel/savoirs.html">Savoirs associés</a> · <a href="audit/index.html">Audit de couverture</a> · <a href="audit/profondeur.html">Audit d’actionnabilité</a></nav></main></body></html>'''
idxp.write_text(center,encoding='utf-8')

# ---------- update search.js with type filter ----------
js=r'''(() => {
  const form=document.querySelector('#resource-search-form');
  const input=document.querySelector('#resource-search-input');
  const typeFilter=document.querySelector('#resource-type-filter');
  const reset=document.querySelector('#resource-search-reset');
  const clearTag=document.querySelector('#clear-tag-filter');
  const active=document.querySelector('#active-filter');
  const activeValue=document.querySelector('#active-filter-value');
  const cards=[...document.querySelectorAll('.resource-card')];
  const count=document.querySelector('#results-count');
  const groups=[...document.querySelectorAll('.resource-group')];
  const empty=document.querySelector('#no-results');
  if(!form||!input||!cards.length)return;
  const params=new URLSearchParams(window.location.search);
  let tag=(params.get('tag')||'').replace(/^#/,'').trim().toUpperCase();
  input.value=(params.get('q')||'').trim();
  if(typeFilter) typeFilter.value=(params.get('type')||'').trim().toLowerCase();
  function normalize(v){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
  function updateUrl(q){const next=new URLSearchParams();if(tag)next.set('tag',tag);if(q)next.set('q',q);if(typeFilter&&typeFilter.value)next.set('type',typeFilter.value);const qs=next.toString();history.replaceState(null,'',qs?`?${qs}`:window.location.pathname);}
  function applyFilters(){const q=input.value.trim(),nq=normalize(q),t=typeFilter?typeFilter.value:'';let visible=0;cards.forEach(card=>{const refs=(card.dataset.refs||'').split(/\s+/).map(v=>v.toUpperCase());const hay=normalize(`${card.textContent} ${card.dataset.search||''}`);const show=(!tag||refs.includes(tag))&&(!nq||nq.split(/\s+/).every(term=>hay.includes(term)))&&(!t||card.dataset.type===t);card.hidden=!show;if(show)visible++;});groups.forEach(g=>{g.hidden=[...g.querySelectorAll('.resource-card')].every(c=>c.hidden);});active.hidden=!tag;activeValue.textContent=tag?`#${tag}`:'';count.textContent=`${visible} ressource${visible>1?'s':''} affichée${visible>1?'s':''}`;empty.hidden=visible!==0;updateUrl(q);}
  form.addEventListener('submit',e=>{e.preventDefault();applyFilters();}); input.addEventListener('input',applyFilters); if(typeFilter)typeFilter.addEventListener('change',applyFilters);
  reset.addEventListener('click',()=>{tag='';input.value='';if(typeFilter)typeFilter.value='';applyFilters();}); if(clearTag)clearTag.addEventListener('click',()=>{tag='';applyFilters();}); applyFilters();
})();'''
(DST/'assets'/'search.js').write_text(js,encoding='utf-8')

# ---------- audit actionability/depth ----------
resources=parse_resources()
rows=[]
for r in resources:
    soup=BeautifulSoup(r['path'].read_text(encoding='utf-8'),'html.parser')
    body=' '.join(soup.stripped_strings); words=len(re.findall(r"\b[\wÀ-ÿ'-]+\b",body))
    method=soup.find('section',class_='resource__method'); checks=soup.find('section',class_='resource__check'); ex=soup.find('details',class_='resource__example')
    steps=len(method.find_all('li')) if method else 0; nchecks=len(checks.find_all('li')) if checks else 0; exw=text_words(ex)
    tool=bool(soup.find('details',class_='resource__tool')); transfer=bool(soup.find('details',class_='resource__transfer')); related=bool(soup.find('section',class_='resource__related')); detail=bool(soup.find('details',class_='resource__referential-detail'))
    # transparent mechanical score: not a pedagogical verdict
    score=0
    score+=2 if words>=400 else (1 if words>=330 else 0)
    score+=2 if steps>=6 else (1 if steps>=4 else 0)
    score+=2 if nchecks>=5 else (1 if nchecks>=3 else 0)
    score+=1 if exw>=30 else 0
    score+=1 if related else 0
    score+=1 if detail else 0
    score+=1 if tool else 0
    level='Renforcée' if score>=9 else ('Actionnable' if score>=7 else 'À approfondir')
    rows.append((r,words,steps,nchecks,exw,tool,transfer,score,level))

level_counts={x:sum(1 for row in rows if row[-1]==x) for x in ['Renforcée','Actionnable','À approfondir']}
trs=[]
for r,words,steps,nchecks,exw,tool,transfer,score,level in sorted(rows,key=lambda x:(x[-2],x[1])):
    rel=os.path.relpath(r['path'],DST/'audit').replace(os.sep,'/')
    trs.append(f'<tr><td><a href="{rel}">{r["id"]}</a></td><td>{escape(r["title"])}</td><td>{words}</td><td>{steps}</td><td>{nchecks}</td><td>{"Oui" if tool else "—"}</td><td>{"Oui" if transfer else "—"}</td><td>{score}/10</td><td>{level}</td></tr>')
prof=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audit d’actionnabilité — BTS GPME</title><link rel="stylesheet" href="../assets/demo.css"></head><body><nav class="demo-nav"><a href="../index.html">← Centre de ressources</a><a href="index.html">Audit de couverture</a><a href="../referentiel/savoirs.html">Savoirs associés</a></nav><main class="resource-page"><article class="resource"><header class="resource__header"><p class="resource__type">Outil de maintenance</p><h1>Audit d’actionnabilité et de profondeur</h1><p class="resource__lead">Le score ci-dessous est un indicateur mécanique de maintenance. Il ne remplace jamais un test avec une mission professionnelle réelle et un étudiant.</p></header><section><h2>État actuel</h2><ul><li><strong>{level_counts['Renforcée']}</strong> ressources renforcées</li><li><strong>{level_counts['Actionnable']}</strong> ressources au niveau actionnable</li><li><strong>{level_counts['À approfondir']}</strong> ressources à approfondir en priorité</li><li><strong>{sum(1 for x in rows if x[5])}</strong> ressources disposent maintenant d’un outil directement reproductible</li><li><strong>{sum(1 for x in rows if x[6])}</strong> ressources comportent une mini-mission de transfert</li><li><strong>{sum(1 for x in rows if BeautifulSoup(x[0]['path'].read_text(encoding='utf-8'),'html.parser').find('section',class_='resource__related'))}</strong> ressources proposent automatiquement des ressources liées</li></ul></section><section><h2>Comment le score est calculé</h2><p>10 points maximum : volume utile (2), méthode suffisamment séquencée (2), autocontrôle (2), exemple professionnel (1), ressources liées (1), rattachement détaillé au référentiel (1), outil directement reproductible (1). La mini-mission est affichée séparément et ne sert pas à gonfler le score.</p></section><section><h2>Tableau de contrôle</h2><div class="audit-table-wrap"><table class="audit-table"><thead><tr><th>ID</th><th>Ressource</th><th>Mots</th><th>Étapes</th><th>Contrôles</th><th>Outil</th><th>Mini-mission</th><th>Score</th><th>Niveau</th></tr></thead><tbody>{''.join(trs)}</tbody></table></div></section><footer class="resource__footer"><p>Objectif des itérations suivantes : traiter d’abord les ressources classées « À approfondir », puis tester les ressources renforcées sur des missions réelles.</p></footer></article></main></body></html>'''
(DST/'audit'/'profondeur.html').write_text(prof,encoding='utf-8')

# ---------- update coverage audit: add knowledge coverage + links ----------
audp=DST/'audit'/'index.html'; soup=BeautifulSoup(audp.read_text(encoding='utf-8'),'html.parser')
nav=soup.find('nav',class_='demo-nav')
if nav:
    if not nav.find('a',href='profondeur.html'):
        a=soup.new_tag('a',href='profondeur.html');a.string='Audit d’actionnabilité';nav.append(a)
    if not nav.find('a',href='../referentiel/savoirs.html'):
        a=soup.new_tag('a',href='../referentiel/savoirs.html');a.string='Savoirs associés';nav.append(a)
# replace old headline count if needed remains 102/102
lead=soup.find('p',class_='resource__lead')
if lead: lead.string='Cet audit contrôle la couverture des tâches et des savoirs associés. La couverture mécanique n’est pas une preuve de maîtrise : l’audit d’actionnabilité complète ce contrôle.'
# add knowledge matrix before evolutive section
for oldsec in soup.find_all('section'):
    if oldsec.find('h2') and oldsec.find('h2').get_text(' ',strip=True)=='Couverture des savoirs associés': oldsec.decompose()
sec=soup.new_tag('section'); h=soup.new_tag('h2');h.string='Couverture des savoirs associés';sec.append(h)
p=soup.new_tag('p');p.string='Le tableau recense les codes de savoirs associés du référentiel et le nombre de ressources qui les mobilisent directement.';sec.append(p)
table=soup.new_tag('table');table['class']='audit-table'; thead=soup.new_tag('thead');tr=soup.new_tag('tr')
for c in ['Référence','Libellé','Ressources']:
    th=soup.new_tag('th');th.string=c;tr.append(th)
thead.append(tr);table.append(thead);tbody=soup.new_tag('tbody')
for code in sorted(KNOWLEDGE,key=sort_code):
    tr=soup.new_tag('tr');
    td=soup.new_tag('td');a=soup.new_tag('a',href=f'../referentiel/savoirs.html#{slug_ref(code)}');a.string=f'#{code}';td.append(a);tr.append(td)
    td=soup.new_tag('td');td.string=' / '.join(KNOWLEDGE[code]);tr.append(td)
    td=soup.new_tag('td');td.string=str(counts.get(code,0));tr.append(td);tbody.append(tr)
table.append(tbody);wrap=soup.new_tag('div');wrap['class']='audit-table-wrap';wrap.append(table);sec.append(wrap)
# insert before resources maintenance section if found
marker=None
for s in soup.find_all('section'):
    if s.find('h2') and 'maintenance évolutive' in s.find('h2').get_text(' ',strip=True).lower(): marker=s;break
if marker: marker.insert_before(sec)
else: soup.find('footer').insert_before(sec)
audp.write_text(str(soup),encoding='utf-8')

# ---------- CSS additions for prototype visualization ----------
cssp=DST/'assets'/'demo.css'
css=cssp.read_text(encoding='utf-8')
css+='''\n/* v0.8 — structural additions; safe to replace with site CSS */\n.resource__referential-detail{margin-top:.75rem}\n.resource__referential-detail dl{display:grid;grid-template-columns:max-content 1fr;gap:.35rem .75rem}\n.resource__referential-detail dt{font-weight:700}.resource__referential-detail dd{margin:0}\n.resource__tool,.resource__transfer{margin:1rem 0;padding:.75rem;border:1px solid #bbb;border-radius:.4rem}\n.resource__tool-table-wrap,.audit-table-wrap{overflow-x:auto}.resource__tool-table,.audit-table{border-collapse:collapse;width:100%}\n.resource__tool-table th,.resource__tool-table td,.audit-table th,.audit-table td{border:1px solid #ccc;padding:.4rem;vertical-align:top}.resource__tool-table td{min-height:1.8rem}\n.referential-knowledge{padding:.6rem 0;border-bottom:1px solid #ddd}.referential-note{font-size:.95em}.referential-knowledge-links{font-size:.95em}\n.resource-search select{min-height:2.4rem}\n.resource__related small{display:inline;color:#555}\n'''
cssp.write_text(css,encoding='utf-8')

# ---------- maintenance tooling ----------
maint=DST/'maintenance'; maint.mkdir(exist_ok=True)
(maint/'referentiel-savoirs.json').write_text(json.dumps(KNOWLEDGE,ensure_ascii=False,indent=2),encoding='utf-8')
(maint/'README.md').write_text('''# Maintenance de la bibliothèque\n\n## Principe\nLes fichiers HTML de `ressources/` restent la source de vérité pédagogique. Les attributs `data-*` portent le rattachement technique au référentiel.\n\n## Après modification ou ajout d’une fiche\n1. Conserver un identifiant `data-resource-id` permanent.\n2. Utiliser uniquement des codes officiels dans `data-activities`, `data-tasks` et `data-knowledge`.\n3. Conserver `data-resource-type` parmi : `methode`, `outil`, `repere`, `regle`. Le libellé visible peut être plus précis.\n4. Mettre à jour `data-verified` et `data-maintenance` si le contenu est évolutif.\n5. Regénérer les index, relations et audits avec le script de reconstruction du projet.\n\n## Règle de fiabilité\nUne fiche marquée `evolutive` doit être vérifiée sur une source institutionnelle avant usage professionnel. Le référentiel 2018 reste la source normative du rattachement pédagogique ; les règles juridiques et téléprocédures doivent, elles, être actualisées.\n\n## Particularité du référentiel\nLe référentiel publié réutilise notamment le code `S.1.4.2` pour deux libellés. La bibliothèque conserve cette anomalie au lieu d’inventer un code qui ne serait pas officiel.\n''',encoding='utf-8')
# preserve this transformation script for reproducibility
shutil.copy2('/mnt/data/build_v08.py',maint/'build_v08_reference.py')

# ---------- README project ----------
readme=DST/'README.md'
readme.write_text(f'''# BTS GPME — Centre de ressources HTML v0.8\n\nVersion orientée **profondeur, traçabilité au référentiel et maintenance**.\n\n- {len(resources)} ressources HTML.\n- 102/102 tâches professionnelles couvertes.\n- Index détaillé des savoirs associés (`referentiel/savoirs.html`).\n- Rattachement détaillé activités / tâches / savoirs dans chaque fiche.\n- Ressources liées générées à partir des références officielles.\n- {len(TOOLS)} ressources renforcées avec un outil directement reproductible.\n- {len(MINI)} ressources renforcées avec une mini-mission de transfert.\n- Audit de couverture + audit d’actionnabilité.\n- Types techniques normalisés : `methode`, `outil`, `repere`, `regle`.\n- Correction de fidélité référentielle : A2.4 utilise `S2_7_1`, tel qu’imprimé dans le référentiel.\n\n## Entrées principales\n- `index.html` : recherche et filtrage.\n- `referentiel/index.html` : blocs, activités et tâches.\n- `referentiel/savoirs.html` : savoirs associés détaillés.\n- `audit/index.html` : couverture tâches + savoirs.\n- `audit/profondeur.html` : indicateur mécanique d’actionnabilité.\n- `maintenance/README.md` : conventions de maintenance.\n\nLe CSS de démonstration est volontairement séparé du contenu et peut être remplacé par le CSS du site.\n''',encoding='utf-8')

# ---------- validation ----------
# local links existence + duplicate IDs + counts
errors=[]; id_dupes=[]
for p in list(DST.rglob('*.html')):
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    ids=[x.get('id') for x in soup.find_all(id=True)]
    dup={x for x in ids if ids.count(x)>1}
    if dup: id_dupes.append((p,dup))
    for a in soup.find_all('a',href=True):
        href=a['href']
        if not href or href.startswith(('http://','https://','mailto:','#','?')): continue
        target=href.split('#')[0].split('?')[0]
        if not target: continue
        resolved=(p.parent/target).resolve()
        if not resolved.exists(): errors.append((p,href,resolved))
print('resources',len(resources),'broken',len(errors),'duplicate_ids',len(id_dupes))
if errors:
    print('BROKEN',errors[:10])
if id_dupes:
    print('DUPES',id_dupes[:5])

# zip
zpath=Path('/mnt/data/bts-gpme-ressources-v0.8.zip')
if zpath.exists(): zpath.unlink()
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED) as z:
    for p in DST.rglob('*'):
        if p.is_file(): z.write(p,p.relative_to(DST.parent))
print(zpath)
