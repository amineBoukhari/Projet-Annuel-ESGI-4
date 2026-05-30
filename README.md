# Projet-Annuel-ESGI-4

Small full-stack demo app (frontend + backend) used for the annual ESGI project.

Repository layout
- `frontend/` - Vite + Vue frontend
- `backend/` - Node + Express backend
- `docker-compose.yaml` - dev compose to run both services

Quick start (development)

1. Build and run both services (rebuild images):

```
make start
```

### Backend: http://localhost:3000


### Frontend: http://localhost:5173


sudo lsof -i :5433

sudo kill <PID>




Gestion de la facturation
Factures clients :
En tant que gérant, je veux créer des factures pour chaque commande afin de facturer correctement les clients.
En tant que gérant, je veux pouvoir modifier une facture avant validation afin de corriger les erreurs éventuelles.
En tant que gérant, je veux annuler une facture en cas d’erreur afin de maintenir la cohérence comptable.
En tant que gérant, je veux consulter l’historique des factures afin de suivre les ventes passées.
En tant que gérant, je veux imprimer ou exporter les factures au format PDF afin de les partager ou archiver.
En tant que gérant, je veux générer des factures automatiquement à partir des commandes validées afin de gagner du temps.
Paiements :
En tant que gérant, je veux enregistrer les paiements reçus afin de suivre l’encaissement des factures.
En tant que gérant, je veux associer un paiement à une facture existante afin d’assurer un suivi précis des transactions.
En tant que gérant, je veux visualiser les factures impayées afin de relancer les clients à temps.
En tant que gérant, je veux générer un rapport des paiements sur une période donnée afin de suivre la trésorerie du restaurant.
Rapports et statistiques :
En tant que gérant, je veux visualiser le chiffre d’affaires par jour, semaine, mois afin de suivre les performances financières.
En tant que gérant, je veux générer des rapports de ventes par produit afin d’analyser les produits les plus vendus.
En tant que gérant, je veux suivre les taxes collectées afin de faciliter la déclaration fiscale.
En tant que gérant, je veux analyser les retards de paiement afin de prendre des mesures pour améliorer le recouvrement


-	Gestion de stock &  fournisseurs 

Stock :

Consulter les stocks : en tant que gérant du restaurant je veux consulter les stocks des ingrédients et produits afin de connaître les quantités disponibles en temps réel.
Ajouter un produit : en tant que gérant je veux ajouter un nouveau produit au stock afin de suivre les nouveaux ingrédients 
Mettre à jour les quantités : en tant que cuisinier je veux mettre à jours les quantités en stock afin de refléter la consommation réelle des produits 
Alerte de stock faible : en tant que gérant je veux recevoir une alerte lorsque le stock d'un produit est bas afin d'anticiper les commandes 
Historique des mouvements de stock : en tant que gérant je veux consulter l'historique des entrées et sorties de stock afin d'analyser la consommation et adapter les commandes 
Renseigner une date de péremption : en tant que cuisinier je veux renseigner une date de péremption lors de l'entrée d'un produit en stock afin de garantir la fraîcheur des produits 
Visualiser les produits proches de la péremption : en tant que gérant je veux visualiser les produits proches de leur date de péremption afin de réduire le gaspillage alimentaire 
Alerte péremption : en tant que gérant je veux recevoir une alerte lorsque les produits arrivent à péremption afin de prendre des mesures rapidement 
Consommation par ordre de péremption : en tant que cuisinier je veux que le système suggère l'utilisation des produits les plus anciens afin de limiter le gaspillage alimentaire 
Retirer un produit périmé : en tant que gérant je veux retirer automatiquement ou manuellement les produits périmés afin de respecter les normes sanitaires 
Historique des pertes et gaspillage : en tant que gérant je veux consulter l'historique des produits jetés ou périmés afin d'analyser les pertes et améliorer la gestion des stocks
Calculer le taux de gaspillage : en tant que gérant je veux connaître le pourcentage de stock gaspillé sur une période donnée afin de mesurer l'efficacité de ma gestion des stocks
Visualiser le gaspillage par produit : en tant que gérant je veux visualiser le taux de gaspillage par produit afin d'adapter mes volumes de commande 
Visualiser le gaspillage par catégorie : en tant que gérant je veux visualiser le gaspillage par catégorie de produits afin d'adapter mes volumes d'achat 
Comparer le gaspillage dans le temps : en tant que gérant je veux comparer le taux de gaspillage entre deux ou plusieurs périodes afin de mesurer l'impact de mes actions 

Fournisseur :
Consulter la liste des fournisseurs : en tant que gérant je veux consulter la liste des fournisseurs afin de gérer mes partenaires commerciaux 
Ajouter un fournisseur : en tant que gérant je veux ajouter un fournisseur afin d'enregistrer un nouveau partenaire 
Modifier un fournisseur :  en tant que gérant je veux modifier les informations d'un fournisseur afin de maintenir les données à jours
Associer des produits à un fournisseur : en tant que gérant je veux associer des produits à un fournisseur afin de savoir qui fournit quoi 
Générer une commande fournisseur : en tant que gérant je veux générer une commande fournisseur à partir des stocks faibles afin de gagner du temps lors des réapprovisionnement 
Suivre l'historique des commandes fournisseurs : en tant que gérant je veux consulter l'historique des commandes fournisseurs afin de suivre les coûts et les délais de livraison 
Ajuster les commandes selon la péremption : en tant que gérant je veux que les propositions de commande tiennent compte des dates de péremption restantes afin d'éviter le sur stock de produits périssables 
Comparer l'évolution des prix : en tant que gérant je veux comparer le prix de plusieurs commandes passées auprès d'un même fournisseur sur une période afin d'analyser l'évolution des prix et optimiser mes coûts d'achat 
Comparer les prix entre fournisseurs : en tant que gérant je veux comparer les prix d'un même produit entre plusieurs fournisseurs afin de choisir le fournisseur le moins chère 
Détecter une variation anormale de prix : en tant que gérant je veux être alerté en cas de variation de prix anormal afin d'anticiper une hausse de coûts 

Gestion du planning

Gérant 


- En tant que gérant,je veux pouvoir consulter mon planning
- En tant que gérant,je veux pouvoir consulter les planning de tous mes employés via un filtre appliqué au planning
- En tant que gérant, je veux pouvoir saisir de nouvelles entrées dans les plannings
- En tant que gérant, je veux pouvoir supprimer des entrées dans les plannings
- En tant que gérant je veux pouvoir modifier des entrées dans les plannings
- En tant que gérant je veux être alerté en cas de demande de modification de planning  d’un employé
- En tant que gérant je veux pouvoir imposer certaines contraintes pour les demandes de modification de planning ( Demande au moins 2 semaines avant le date de modification, … )

Employé 

- En tant qu' employé, je veux pouvoir consulter mon planning
- En tant qu' employé, je veux pouvoir demander une modification sur mon planning
- En tant qu ’employé, je veux pouvoir naviguer dans mon planning sur plusieurs semaines


US DE BASE: 

En tant qu’utilisateur, je veux pouvoir me connecter à la plateforme via un identifiant et un mot de passe


En tant qu’utilisateur je veux accéder à une page de statistiques en fonction de mes droits et de ma fonction 


En tant que gérant je veux pouvoir ajouter une fiche utilisateur en cas d’embauche d’un nouvel employé


En tant que gérant/associé je veux une sécurisation des accès et des fonctionnalité en fonction du rôle et de la fonction de l’employé


En tant que gérant/associé je veux un accès total à toute les fonctionnalités de l’application


## bottom liens 

Authentification & Autorisation


Facturation & Paiements


Stock & Fournisseurs


Planning & Gestion du personnel


Rapports & Statistiques


##breakdown : 


Nom du projet : 


Description courte du projet : 
L’objectif est de créer une application web (mobile ?) afin d’aider les restaurateurs à organiser, gérer leur dépenses, factures, recettes, employés de leur organisation. 
Nous souhaitons une vision en DDD, où le souhait des restaurateurs est la base du projet et du développement du produit. De fait, nous souhaitons réaliser un sondage auprès des restaurateurs afin d'être plus en accord avec le métier. 

Objectif principal : 
Simplifier la vie des restaurateurs ainsi que de leurs salariés, réduire les pertes et augmenter les bénéfices. Faire plus avec moins.

Problème auquel répond le projet : 

Dépenses et factures chaotiques


Mauvaise gestion des fournisseurs


Faible visibilité sur le coût des ingrédients / coût matière


Routines du personnel non respectées


Tickets/notes de frais perdus & documents manquants


Problèmes liés aux frigos / au stock


Mauvaise communication entre le propriétaire et le personnel


Mauvaise gestion des déchets


Aucune idée du bénéfice quotidien


Recettes non standardisées → qualité des plats incohérente



Fonctionnalités attendues : 

gestion par restaurant
Penser au POS ? API ou qqc du genre ?
Gestion de la facturation (Amine) 
Gestion du planning (Lucas)
Gestion et comparaison des fournisseurs et tarifs
Gestion de stock & fournisseurs ( Louis )
Intégration d’IA ? (reporting)

Répartition des tâches

Scrum Master (JIRA): Thomas
Product Owner (Vision produit): Amine
Architecture logiciel - Amine & Thomas
Design (UI) - Lucas et Louis
Développement Front & back - Répartitions en fonction des features
Par exemple:  IA sera désigné à Thomas / Gestion d’inventaire par Lucas


Le sondage:

Avez-vous un logiciel de gestion pour votre restaurant ?
Si oui, quelles sont les fonctionnalités principales de celle-ci ?
Quelles fonctionnalités trouvez-vous indispensable ?
Quelles fonctionnalités trouvez-vous incohérentes ?
Quel(s) logiciel(s) utilisez-vous et dans quel but ? (facultatif) 
Quel aspect de votre métier trouvez-vous compliqué à gérer ?
Quel aspect de votre métier trouvez-vous long à gérer ?
Si vous pouviez vous même créer une application, quelles en seraient les fonctionnalités que vous attendrez afin de répondre parfaitement à vos besoins ?










User Feedback on Small Business ERP Systems for Expense & Bill Management
Key Features Small Businesses Rely On for Tracking Expenses & Bills
Small businesses (under 50 employees) consistently highlight a few indispensable features in their ERP/accounting systems for managing expenses, vendor bills, and fees:
Unified Financial Dashboard & Bank Integration: Owners value having all payments, expenses, and accounts in one place. For example, a retail business user of QuickBooks praised the ability to monitor “all payments made to the company and all expenses in the same place,” with all bank accounts and credit cards linked centrallyg2.com. This unified view (often via bank feeds) helps businesses track cash flow and expenses in real time without hopping between systems.


Vendor Management & Bill Tracking: The ability to organize bills by vendor and track payables is a commonly cited benefit. In QuickBooks, “being able to look up things by vendor is great,” one user notedg2.com. Small companies rely on features like vendor directories, due-date reminders, and easy bill payment workflows. SAP Business One users similarly appreciate that the system makes it “easy to pay and bill vendors and customers,” indicating strong accounts payable functionality out of the boxtipalti.com.


Expense Capture & Reporting: Owners of service and trade businesses value easy expense entry (e.g. logging receipts, mileage, project expenses) and reporting tools. Users of Zoho Books mention the “ease with which invoices, expenses, and reports can be managed” as a favorite aspectsoftwareadvice.com. In Zoho’s case, the simple user interface makes it straightforward to record expenses and pull expense reports. Having built-in expense modules or integrations (such as receipt scanning apps or employee expense reimbursements) is considered a big plus for controlling costs.


Invoicing & Billing Features: Although focused on outgoing invoices, many small businesses note that robust invoicing features also help with cash flow and fee management. QuickBooks and Zoho both allow customized invoice templates and recurring invoices. QuickBooks lets you insert direct payment links into invoices for faster client paymentsliveflow.com. Zoho offers a large selection of invoice templates (16 standard) and even encrypts PDF invoices for security, which some businesses appreciateliveflow.com. While invoicing is outbound, it complements bill tracking by providing a full picture of payables vs. receivables.


Real-Time Reports and Dashboards: Having up-to-date financial reports is crucial. Users praise systems that offer ready-made reports for expenses, vendor balances, and cash flow. One Zoho Books user noted that live reports on the platform “allowed me to make well-informed decisions regarding budgeting and cash flow,” helping to streamline accounting in a busy quartersoftwareadvice.com. Small business owners rely on profit/loss statements, expense summaries by category, and vendor aging reports to stay on top of finances. They expect these to be easy to generate by date range or project.


Automation & Rules: Automation is increasingly expected (discussed more below). Briefly, features like bank rules that auto-categorize expenses, recurring bill scheduling, and auto-reminders for payments due are highly valued. Users like having routine tasks handled automatically so they can focus on running the business. For instance, QuickBooks can automatically import bank transactions and suggest categories; this simplifies bookkeeping “if you have simple needs” and lets owners do accounting quicklystellarone.io, though it’s not foolproof as discussed later.


In summary, small businesses rely on ERP/accounting platforms that give them a one-stop solution for payables management – from entering bills and expenses, to tracking vendors, to paying those bills – along with the reporting to monitor it all. When these core features are intuitive and reliable, owners consider the software a crucial tool for managing company finances.
Common Complaints and Dislikes
Despite the benefits, owners of small and medium businesses voice a number of recurring complaints about popular ERP systems used for expense and bill management:
Steep Learning Curves & Complexity: A top gripe, especially for more full-featured ERPs, is that they can be overly complex or not user-friendly. SAP Business One, for instance, is respected for its depth but many find it not intuitive for non-accountants, with a “significant learning difficulty” for newcomersg2.com. Odoo, an open-source ERP, draws similar criticism: one small business owner described it as “complicated, uses foreign accounting terms (I’m US-based), and it’s NOT user friendly.” They regretted trying to self-implement Odoo without an IT teamreddit.com. This sentiment is echoed by others who say Odoo’s default interface is clunky and requires significant customization to fit their needstipalti.com. In general, when a system isn’t straightforward, owners feel it slows down their bill tracking – “a simple task can be complicated because there are too many options and buttons,” as one Microsoft Dynamics GP user noted of that ERP’s designtipalti.com. Small business users dislike having to hire consultants or spend weeks learning software just to do routine bookkeeping.


Poor Customer Support: Another frequent complaint is inadequate support when issues arise. Small companies often lack in-house IT, so they rely on the software vendor’s support. Unfortunately, many reviews cite frustrating experiences: “When we have issues, it is difficult to get a real answer from customer service,” a G2 reviewer said of QuickBooks, noting they resort to Googling for solutionsstellarone.io. Odoo’s users have been especially vocal about support woes – once you become a paid client, “it is extremely difficult to receive direct and proper customer support…instead of solving [issues], they simply redirect you to their website,” according to one verified reviewsoftwareadvice.com. Another business owner recounted waiting three weeks for Odoo support to answer a help ticket about connecting a bank account (which still didn’t get resolved)reddit.com. Such delays are unacceptable for a small firm that needs to manage bills now, not weeks later. Across many platforms, users dislike scripted or unhelpful support and long response times.


Cost and Pricing Frustrations: Small businesses are very cost-sensitive, and many complaints revolve around pricing models. QuickBooks in particular draws fire for its pricing and fees. Users mention that while QuickBooks Online’s base subscription seems affordable, add-ons quickly drive up costs. TechRadar noted that adding extra functionality can “rapidly increase the total cost”stellarone.io. For example, payroll, advanced inventory, or time-tracking each cost extra in the QuickBooks ecosystem. One accountant warned that if a business needs features like robust inventory tracking or job costing, “then QuickBooks Online may not be right” unless you pay for higher tiers or additional toolsstellarone.io. Odoo’s pricing gets criticism from another angle: while the software license itself can be cheap (or free for the community version), implementation and hidden costs surprised users. “The application seems reasonably priced, but not when you add the cost of implementation and training support!” said one small business owner, who felt misled by sales about how easy it would be to self-implementreddit.com. They ended up paying for a year and couldn’t even use the platform due to setup difficulties – a costly mistake. In short, complaints abound when the total cost of ownership (including subscriptions, add-ons, consulting, or upgrade fees) exceeds expectations.


Missing or Weak Features: Business owners also dislike when an ERP system lacks a feature they assumed it would have. For instance, Zoho Books users mention that payroll is not built-in – you must add Zoho Payroll or a third-party service, unlike QuickBooks which has integrated payroll optionsliveflow.com. This can be a deal-breaker for those who want all-in-one. Some QuickBooks Online users complain that certain advanced features from the old Desktop version are missing online. One small construction company owner lamented, “Everything convenient on the desktop version was stripped out [in the online version]… I run a small excavation company and if anyone has a software they prefer let me know. QB lost my business forever.”reddit.com. Similarly, customization limits are a common dislike: a TrustRadius review noted QuickBooks’ dashboard is not very customizable for more sophisticated needsstellarone.io. Zoho Books reviewers also wished for richer customization of invoices and reports, finding the out-of-the-box templates “a bit limited” and genericsoftwareadvice.com. In the expense tracking arena, users of various platforms want features like more flexible expense categorization, support for multiple business units, or industry-specific functions – and they complain when these are lacking.


Integration and Connectivity Issues: Small businesses often use multiple apps (CRM, e-commerce, payroll services, etc.), so integration is expected. A common complaint is when software doesn’t play nice with others. QuickBooks is praised for broad integrations, but users still report that connecting some tools (like a Square POS) can involve “complex troubleshooting” and technical fiddlingstellarone.io. Zoho Books, while part of a larger suite, has a more limited integration ecosystem (about 30 integrations) compared to QuickBooks’ hundredsliveflow.com, which a few users find limiting. One Zoho user noted that their particular payment processing app wasn’t integrated, “which creates a bit more manual work for us.”softwareadvice.com. In general, if an ERP requires manual data import/export because of poor integration, users will complain that it defeats the purpose of having an “automated” system.


Performance and Technical Problems: A subset of complaints center on reliability – slowness, bugs, or difficulties in use. Some QuickBooks Online users have groaned about recent updates causing slowdown and frequent log-outsg2.com. Odoo users on forums report encountering cryptic errors (e.g. “something went wrong” with no helpful inforeddit.com) and numerous bugs that require support tickets. If an app is sluggish or error-prone, small business owners quickly become frustrated since they often don’t have an IT team to troubleshoot. They expect a stable tool that “just works” for everyday expense and billing tasks.


In summary, common dislikes include high complexity (especially for ERPs like SAP B1 or Odoo), insufficient support, unexpectedly high costs, missing features, and technical hiccups. These pain points often lead users to vent in reviews or even switch systems in search of something easier or cheaper.
Features Users Say Are Missing or Need Improvement
Beyond general complaints, small business users often call out specific feature gaps or improvements they’d like to see in these systems:
Better Customization & Reporting: A frequent request is for more customizable reports and dashboards. Owners want to tailor invoices, financial reports, and views to their needs. As noted, QuickBooks Online’s lack of a customizable dashboard was cited as a drawback by some usersstellarone.io. Zoho Books users similarly mention that invoice and report templates can feel too rigid or “generic,” wishing for more flexibility to match their branding or drill into datasoftwareadvice.com. Additionally, while both QuickBooks and Zoho offer many reports, accountants say automation of reporting is not as comprehensive or easy as they’d likeliveflow.com. This has led to third-party tools or manual workarounds (for example, exporting to Excel/Sheets) to get advanced or consolidated reports. Users are essentially asking for more powerful built-in analytics and easier customization to avoid those extra steps.


Payroll and HR integration: For platforms that don’t include payroll or time-tracking natively, users see it as a missing piece. As mentioned, Zoho Books requires using Zoho Payroll or another app – thus many call for built-in payroll so they don’t have to manage a separate systemliveflow.com. Similar sentiments are voiced about inventory in entry-level accounting packages: e.g., some QuickBooks Online users who need assembly or multi-warehouse inventory management find the base product lacking and would prefer those capabilities included rather than having to upgrade to QuickBooks Advanced or bolt on another appstellarone.io.


Industry-Specific Features: Small manufacturers, retailers, or contractors often find generic accounting software lacking niche features. Light manufacturing businesses might say they need better bill of materials or job costing tools. A QuickBooks expert noted job costing is a pain point in QBO without add-onsstellarone.io. Retailers might want POS integration and inventory barcode scanning; if not provided, it’s a noted gap. Service businesses might look for improved project expense tracking or integrations with field service software. When an ERP isn’t specialized, users often mention these as features “we wish it had.”


Multi-currency and Multi-entity Support: As some small businesses grow or operate internationally, they discover limitations here. For example, Xero users love its small biz focus but note it’s “not great for multi-company businesses” – you can’t be logged into multiple entities simultaneously and have to handle intercompany transactions manuallycapterra.com. A user who manages two small companies might wish the software allowed a consolidated view or easier switching between company files. Similarly, multi-currency expense handling is sometimes raised – if a system doesn’t automatically handle currency conversion on expenses or bills, users consider that a missing feature in today’s global marketplace.


Mobile App Functionality: While most leading platforms have mobile apps, users occasionally point out what the apps can’t do. For instance, an owner might want to approve a vendor bill or scan a receipt from their phone even while offline. If the mobile app is read-only or limited (e.g., perhaps SAP Business One’s mobile app is limited in features compared to desktop), they’ll request improvement. The expectation is full or near-full functionality on mobile, so missing features on the mobile side are often mentioned by on-the-go business owners (like contractors working at job sites).


Offline Access or Local Backup: In an era of cloud software, offline capability is rare – yet a subset of users in areas with unreliable internet, or those simply uncomfortable with fully cloud systems, express desire for an offline mode or local data backup. QuickBooks Desktop fulfilled this need historically, and some users still prefer having a locally installed option. The shift to cloud-only has led to grumbling; as one Reddit user quipped about QuickBooks Online, “it’s also a roach motel: business owners are let in…they can’t get out,” referring to the difficulty of exporting data out for use elsewherereddit.com. This comment underscores a wish for easier data export (so you’re not locked in) – essentially the ability to take your books offline or migrate without hassle. Many small businesses would like improvements in data portability, such as one-click CSV exports of all bills, expenses, and vendors, which some felt was not straightforward in certain systemsreddit.com.


Automation & AI Enhancements: Users increasingly expect smart automation. When present, they want it better; when absent, they request it. One area is transaction categorization – QuickBooks will auto-suggest categories for expenses based on rules or AI, but as a user complained, “the tools sometimes put things in the wrong category, requiring you to verify each line, which defeats the purpose.”g2.com They want the AI to be more accurate so it truly saves time. Others might ask for automated bill scanning/OCR (upload a vendor invoice and the system auto-creates the bill entry), or automated workflows (e.g. an approval process for large expenses). If the software doesn’t have these, users flag them as features to add.


In essence, small business users are asking vendors to bridge the gap between basic accounting and their real-world needs. They want more customization, integrated payroll/HR, better support for multiple entities or currencies, robust mobile and offline capabilities, and smarter automation. These are the areas where current solutions often fall short for them, and they’re vocal about wanting improvements.
Usability and Complexity Issues
Usability is a critical factor for small businesses (which often lack dedicated IT staff or accountants), and feedback shows a divide: some systems are praised for being easy, while others are notorious for complexity. Here’s what users are saying:
QuickBooks – Generally User-Friendly (for Simple Needs): Many small business owners find QuickBooks fairly approachable. Industry experts and users alike often describe QuickBooks as having a “user-friendly interface” that “simplifies accounting for small businesses,” making invoicing and expense tracking straightforwardstellarone.io. One G2 reviewer noted QuickBooks is “easy to use for a novice person… [a] new person can start using the software without even formal training.”stellarone.io This ease of use is frequently cited as a major advantage – part of why QuickBooks has such dominance in the market. As another user put it, “If you have simple needs, QuickBooks makes it easy…you can do your accounting quickly.”stellarone.io. However, this usability drops if you try to do more complex things; the interface is friendly for basic bookkeeping, but power users then run into its limits (lack of advanced customization, etc., as noted above). There’s also a split between QuickBooks Desktop and Online: some long-time Desktop users find the transition to QuickBooks Online clunky. The excavation company owner who “wanted to eat a bullet” when faced with QBO was clearly overwhelmed because the online UI and workflows felt less efficient to them than the old desktop UIreddit.com. In summary, QuickBooks earns good marks for general ease of learning and day-to-day use, but changes in the platform or pushing beyond basics can cause frustration.


Zoho Books – Clean Interface and Easy Navigation: User reviews frequently praise Zoho Books for its clean design and intuitive workflow. As one user succinctly said, “The simple user interface and ease [of] invoices, expenses, and reports” were their favorite featuressoftwareadvice.com. The learning curve is described as mild; if you’re reasonably tech-savvy, you can pick it up quicklyliveflow.com. In head-to-head comparisons, both Zoho and QuickBooks are deemed “simple, intuitive, and easy to master” by most users, provided you have basic bookkeeping knowledgeliveflow.com. Zoho’s menu layouts and online help resources get positive feedback, and it’s often recommended for owners who might be overwhelmed by a full ERP. Of course, it’s a focused accounting system, so its simplicity is partly because it doesn’t try to do everything in one interface. That said, users consider Zoho’s approach to be very user-friendly for daily expense and billing management (entering bills, reconciling expenses, generating invoices, etc.), with one even noting that Zoho’s design and live data made their accounting “well-informed” and decision-making easiersoftwareadvice.com.


Odoo – Powerful but Notoriously Difficult for Non-Experts: Odoo’s usability is a hotly debated topic. It’s an ERP that can do almost anything via modules – which also means it’s not easy out-of-the-box for the average small business. Numerous firsthand accounts from small business owners describe the UI as unintuitive and the setup as arduous. “It’s still an ERP with a lot of complex configuration…likely requires an implementation partner if you’ve never done this before,” cautioned one user comparing Odoo to alternativesreddit.com. The default interface is seen as clunky (one source even lists that as a known con)tipalti.com, and workflow isn’t as guided as in simpler tools. A frustrated Odoo user on Reddit went so far as to say “I deeply regret it” and that as a one-person business, they felt misled by sales claims that it would be easy to manage alonereddit.comreddit.com. They found themselves waiting weeks for support, unable to figure out basic tasks like entering beginning balances – clearly indicating the system was not designed for self-taught newbies. Another commenter bluntly concluded: “Odoo is too manual… especially without IT knowledge… I moved back to QuickBooks. Odoo’s accounting module has a very sophisticated learning curve.”reddit.com. In essence, unless a small business has someone with ERP implementation experience, Odoo’s learning curve can be prohibitive. (On the flip side, those with technical background or who invest in training can eventually harness it – but the average user’s feedback is that it’s too much work for managing bills compared to simpler solutions.)


SAP Business One – Robust but Challenging: SAP Business One targets small-to-mid companies, but it carries the SAP legacy of being feature-rich and somewhat complex. Users acknowledge that it’s a stable, powerful system once learned, but the interface and navigation can overwhelm first-time users. G2’s analysis found multiple mentions that SAP B1 is “not user-friendly, particularly for non-accountants”g2.com. There’s talk of a “steep learning curve”g2.com – even those with some accounting knowledge need significant training to fully utilize it. One common theme: if you’ve only used simple accounting software before, SAP B1’s terminology and breadth (modules for everything from CRM to manufacturing) can be daunting. That said, some users do call the user interface “simple and easy to use” once you know ittipalti.com – possibly in comparison to larger SAP products or other ERPs. So, much like Odoo, SAP B1’s usability is relative: for an ERP it might be considered easy, but for a true small business novice it’s quite complex. The consensus is that SAP B1 is best used with professional help (either a consultant partner or a trained internal user), which is a barrier for the smallest companies.


Other Platforms: Many small businesses also consider alternatives like Xero or FreshBooks for ease of use. Xero in particular is often lauded for a very friendly interface. Users say “It is really made for non-financial people, so the whole thing is really user friendly.”capterra.com. Xero’s design, onboarding, and help articles cater to owners without accounting backgrounds, making it a favorite for those who prioritize simplicity in expense and bill management. FreshBooks (targeted at very small teams or freelancers) similarly focuses on an easy invoicing and expense experience, though it’s less about vendor bills and more about client billing. The key takeaway from these is that ease-of-use can often trump raw features for small businesses. Many are willing to trade advanced functionality for a system that their staff can actually understand and use daily.


In summary, usability varies widely: QuickBooks and Zoho Books tend to hit the sweet spot for small companies by balancing features with an intuitive interface, whereas full ERPs like Odoo and SAP B1 are frequently criticized for being too complex without expert guidance. The feedback consistently underscores that small business owners want software that “just works” and doesn’t require a steep learning investment to manage their expenses and bills.
Platform Reputation: Which Systems Do Users Love or Hate?
Looking across the major platforms, each has developed a certain reputation in the small business community based on user reviews and testimonials:
Intuit QuickBooks (Online & Desktop): Widely used, with both strong praise and sharp criticism. QuickBooks is by far the market leader (over 40% market share in accounting software)liveflow.com, and many owners stick with it because it’s the devil they know. Positive reviews consistently highlight its rich feature set for a small-business accounting tool and the convenience of an all-in-one solution. QuickBooks Online has won awards (PCMag’s Editors’ Choice, etc.) for offering “a class-leading range of flexible features and reports without sacrificing ease of use.”stellarone.io Users love features like expense tracking, invoicing, and bank reconciliation being well-integratedstellarone.io. On the other hand, QuickBooks draws consistent negative feedback on certain fronts: customer support (many find Intuit’s support slow or unhelpfulstellarone.io), pricing practices (the move to subscription and upselling of add-ons has frustrated customersreddit.comstellarone.io), and product changes (the forced migration from Desktop to Online in recent years caused backlash among loyal Desktop users who felt the online version was less robust). It’s telling that some businesses actively seek QuickBooks alternatives – yet often, they also acknowledge that QuickBooks “excels as a small business accounting application” in core functionalitystellarone.io. In sum, QuickBooks has a bit of a love-hate reputation: loved for its capabilities and familiarity, hated for Intuit’s business decisions and the occasional technical annoyances. It still generally “delivers powerful features and reliability,” as one bookkeeper put itg2.comg2.com, which is why it remains highly recommended for many small companies despite the gripes.


Zoho Books: An underdog that earns a lot of love from those who use it. Zoho Books has a smaller user base (tiny market share relative to QuickBooks)liveflow.comliveflow.com, but its users often become fans. It boasts an excellent 4.4/5 average rating in online reviewssoftwareadvice.com. Consistently positive reviews mention its ease-of-use, affordability, and clean features. Many freelancers and small businesses “graduate” to Zoho Books when they outgrow spreadsheets and find it delightfully straightforward. They also appreciate Zoho’s ecosystem if they use other Zoho apps (CRM, inventory, etc.). A typical user comment is that Zoho Books “has…professional accounting tools without paying enterprise prices,” delivering great valueforbes.com. Another theme is reliability – fewer complaints about bugs or crashes compared to some competitors. Negative reviews of Zoho Books are relatively scarce, and usually about specific limitations (like lack of native payroll, or an integration one user needed that wasn’t availablesoftwareadvice.com). Some also note Zoho’s customer support hours are not 24/7 (since the company is based in India, support is typically business hours in their time zone)liveflow.com. This can frustrate users who need off-hours help. And, as with any software, a handful of users might encounter a feature gap that irks them (e.g. a report they can’t customize). But overall, Zoho Books enjoys a positive reputation among small businesses, often described as a “simple yet comprehensive” solution for companies on a budget.


Odoo (ERP): Powerful and flexible, but with very polarizing feedback. Odoo’s reputation in the small business world is mixed — some consider it a game-changer for providing ERP capabilities at low cost, while many others recount horror stories. On the positive side, companies that successfully implement Odoo praise the breadth of its functionality (you can manage everything from sales to inventory to accounting in one system) and the fact that it’s open-source and modular. They like that it’s highly customizable and can be tailored to their unique processes (something harder to do in off-the-shelf products). One user review noted Odoo “allows you to see each and every transaction… no one can steal from you,” highlighting its detailed audit trail and control softwareadvice.com. However, negative reviews dominate many discussions, especially from very small outfits. Common phrases include “awful experience”, “not a COTS application” (not truly off-the-shelf), “a money hole”, and “a nightmare which you cannot escape.”reddit.com These come from users who underestimated the effort needed to make Odoo work. Issues like poor support, needing to hire expensive consultants for customizations, and a long implementation time are frequently citedreddit.comreddit.com. For example, a user complained every bug fix or minor tweak was “sold… as an extra feature” costing consulting hours, and that it fell apart once they started really using itreddit.com. That kind of experience leads to extremely negative sentiments and sometimes public warnings to fellow small business owners. In community forums (like Reddit), Odoo partners sometimes defend the product, but even they agree that Odoo is not a plug-and-play solution for a tiny company – it requires expertise to implement properlyreddit.com. Overall, Odoo gets consistently high marks for feature completeness and customizability (it’s often called a full ERP suite in a world of limited accounting apps)g2.comg2.com, but equally consistent criticism for usability and support in the small business context. It’s either loved by those who can leverage it or hated by those who feel burned by it.


SAP Business One: Solid ERP credibility, but seen as heavy and best for larger small businesses. SAP B1 tends to have positive reviews about its robustness – users say it “still delivers what a good ERP is expected [to]”softwareadvice.com. It’s often described as stable and reliablecapterra.com, with strong functionality especially in financials and inventory for small-medium enterprises. Many reviewers note it’s “worth the money” for companies that need a comprehensive ERPcapterra.com. There’s also appreciation for the “excellent customer support from SAP partners” by some usersg2.com (SAP sells B1 through partners who handle implementation and support, and good partners earn user praise). That said, SAP B1’s negative points are quite consistent: complexity and cost of customization. Multiple users mention the product is “difficult to navigate” and has a “steep learning curve”g2.com – not unlike Odoo in that sense. It’s also noted that tailoring SAP B1 or integrating it with other tools can be “complicated and costly”g2.com, which for a small business can be daunting. Some reviews from smaller companies feel that SAP B1 is a bit overkill or “has business size limitations” – implying that if you’re a very small operation, you won’t get as much value due to the effort neededg2.com. In short, SAP Business One is positively viewed by growing small businesses or those with in-house IT/accounting expertise, and it gets negative feedback from very small or less-resourced businesses that find it too much to handle. It doesn’t generate the volume of complaints that QuickBooks or Odoo do (likely because its user base among sub-50-employee firms is smaller and more filtered by who can afford it), but it has a clear reputation of “great capabilities, if you can handle the complexity.”


Other Notables – Xero, etc.: Xero is worth mentioning as it often comes up in small biz discussions as a beloved alternative to QuickBooks. Its user reviews are consistently positive about ease of use (as noted earlier, “fast and easy to set up…really user friendly”capterra.com) and value for money. Xero users often tout the strong community and support resources as well. It doesn’t have the huge U.S. market share of QuickBooks, but those who use it rate it highly (in one GetApp summary, 82% of reviewers were positive about Xero and felt it’s very well-suited for small businessesgetapp.com). Negative feedback for Xero tends to be around recent price increases and removing features (like built-in payroll in some regions) – e.g., some long-time users complained about price hikes and loss of functionality in 2024, calling it “a cash grab”apps.apple.comcapterra.com. This shows even a well-liked platform can suffer reputation dips if the company makes unpopular changes.


In conclusion, QuickBooks remains the most broadly used (with a mix of admiration and annoyance), Zoho Books enjoys a quiet but strong positive reputation, Odoo and SAP B1 are respected for capabilities but often criticized on usability/support, and Xero is frequently praised as an extremely user-friendly solution for small businesses. The “best” platform in users’ eyes ultimately depends on their priorities – ease-of-use vs. depth, initial low cost vs. long-term scalability – which is why opinions are so varied.
Preferred Pricing Models for Small Businesses
When it comes to pricing, small and medium business owners tend to prefer models that are affordable, predictable, and scale with their needs. Feedback from 2023–2025 reveals a few clear patterns in what these users want (and don’t want) in pricing:
Low Monthly or Annual Cost – and Clear Value: Small businesses usually operate on tight budgets. Many express that they’re willing to pay a subscription if the price is reasonable and the value is clear. For instance, Zoho Books gets praise for its budget-friendly pricing – it even offers a basic free tier for very small businesses, which makes it “very attractive for businesses that are just starting out and trying to keep overhead low.”liveflow.com Users appreciate when pricing tiers align with company size (e.g., an entry-level plan under $20-30/month for a tiny business). QuickBooks Online’s lower-tier plans often satisfy startups, but as needs grow, costs can ramp up quickly, which is when discontent sets instellarone.io. Transparency in pricing is key: Odoo, for example, advertises no hidden costs and a low per-user fee, which initially attracts cost-conscious buyers. But some felt the true cost wasn’t clear until later (implementation, necessary add-ons, etc.) – a user complained that after adding required services, the “reasonably priced” subscription didn’t feel so reasonablereddit.com. Thus, small businesses prefer up-front honesty about all costs.


Subscription vs. One-Time Purchase: There has been a shift industry-wide from one-time license models to subscriptions, and small business users have mixed feelings. On one hand, many accept that “most companies…are shifting to [subscription] models” (like Adobe, Spotify, etc., as one user noted) and thus see a continuous monthly fee as the new normalreddit.com. This model can be easier on cash flow (smaller monthly payments instead of a big lump sum) and ensures they always have the latest software version. On the other hand, there remains a nostalgic (and vocal) segment that preferred one-time purchases – for example, longtime QuickBooks Desktop users who just wanted to “BUY a copy of QuickBooks Pro 2024” outright instead of being forced into an annual planfacebook.com. These users argue that perpetual licenses were cheaper in the long run and dislike being locked into endless payments. The backlash Intuit faced when making all Desktop versions subscription-based shows that many small businesses would choose a one-off purchase if it were offered. In summary, newcomers often don’t mind subscriptions, but older or cost-conscious owners sometimes pine for the option to pay once and own the software.


Modular or Usage-Based Pricing: Small businesses also favor pricing that lets them pay only for what they use. If an ERP has modules, they appreciate being able to pick a smaller bundle. Odoo’s model of pricing by the number of users (and previously by modules) can be attractive: very small teams pay little. However, the downside is if they need many modules or grow their user count, the cost can scale up unexpectedly. Many have found that add-on fees creep up – e.g., QuickBooks charging extra for each additional feature or user. An ideal model mentioned in discussions is one where basic features for expense/bill tracking are included, and any extra-fee features are truly optional. Owners also like when there’s a flat rate or fixed package for small business editions. For instance, SAP Business One is often sold in packages for a certain number of users and functions; while not cheap, at least the cost is somewhat fixed upfront (aside from maintenance). Predictability is key: nothing annoys small companies more than surprise price changes or upsells after they’ve adopted a platform. A recent Xero reviewer voiced frustration that the company raised prices while removing features, after they had been a loyal customer for yearscapterra.com. Such moves erode trust. Thus, user preference skews toward vendors who keep pricing stable and only increase costs when delivering commensurate new value.


Freemium and Trials: Small business owners love to “try before they buy.” Generous free trials or free tiers build goodwill. Zoho’s forever-free plan (albeit limited) is a good example that got attentionliveflow.com. QuickBooks often runs promotions (like 50% off for 3 months) and offers a 30-day trial, which users do take advantage of. This is almost expected now – any ERP or accounting tool without a trial might be passed over, as owners want to test if it fits their bill-tracking needs. Freemium models (free up to X invoices or X users) are appreciated by the smallest businesses and startups, and many will stick with a product and eventually upgrade if they had a positive free experience.


Avoiding Lock-In and Exit Costs: Another aspect of “preferred pricing” is actually what happens when leaving a platform. Users have learned to be wary of exit barriers – for instance, if they cancel a cloud subscription, will they still have read-only access to their data, and for how long? In one Reddit story, a non-profit had a QuickBooks Online account and upon closing it, found Intuit “basically just closed it immediately… I assume they just delete the data” – they were concerned they couldn’t easily get their records outreddit.com. (Intuit reps clarified you do get a read-only period, but the user wasn’t guided through exporting). Preferred practice, from a user perspective, is that vendors provide an easy way to export all your expense and bill data at no extra cost when you end the subscription. Small businesses favor companies that don’t “trap” them – hence a pricing model that includes data portability and doesn’t levy penalties for canceling is seen positively. This also circles back to the “roach motel” complaint about QuickBooks Onlinereddit.com – it’s not a direct pricing issue, but it affects the overall cost/benefit calculation if leaving is painful.


In summary, small businesses lean toward pricing models that are straightforward, affordable, and flexible. Monthly SaaS pricing is widely accepted, but it must be reasonable and stable. Free trials or tiers are big pluses. Conversely, sudden price hikes, nickel-and-diming for essential features, or feeling forced into a more expensive edition are all recipes for user dissatisfaction. The ideal is a fair subscription that grows with the business without nasty surprises – essentially, pricing that “feels worth it” given the software’s benefits.
Integration, Mobile, Offline, and Automation Expectations
Modern small business owners expect their ERP or accounting systems to seamlessly fit into their workflow – which means integrating with other tools, accessible anywhere, and automating tedious tasks. Here’s what users are saying about these aspects:
Integrations with Other Software: It’s almost a baseline requirement now that an ERP/accounting system connects to the rest of a business’s software stack. Users anticipate out-of-the-box integrations or at least easy APIs for things like e-commerce platforms, CRM systems, payroll services, payment processors, and point-of-sale systems. QuickBooks is frequently lauded here – one comparison noted QuickBooks “will connect and integrate with well over 650” other software/services, whereas Zoho Books had around 30 integrations at the timeliveflow.com. This breadth is a selling point; small businesses using niche tools want confidence that their accounting software can plug in or at least exchange data easily. When integration falls short, as mentioned earlier, users complain about the extra manual worksoftwareadvice.com. A concrete expectation is bank integration: nearly every user expects to connect bank accounts and credit cards for automatic feed of transactions (which most systems do). They also expect integration with popular apps like PayPal, Stripe, Shopify, Amazon, etc. If an ERP doesn’t have a direct integration, users at least look for Zapier connectors or import/export capability. In short, the system shouldn’t exist in a silo. One G2 review highlighted that QuickBooks “is so connected to everything” that you almost feel obliged to use itg2.com – a testament to Intuit’s integration ecosystem (though that reviewer also bemoaned the high price, implying they felt stuck because of those integrations). The ideal scenario for users is one-click sync between their expense management software and whatever else they use to run the business.


Mobile Access and Use on the Go: For tradespeople, consultants, and retail managers alike, being able to use their ERP features on a smartphone or tablet is crucial. Users expect to, at minimum, check financial reports, record expenses (even snapping a receipt photo), send invoices, and approve or pay bills from a mobile app. QuickBooks and Zoho both offer mobile apps that users find handy for basic tasks. PCMag’s review of QBO emphasizes that it provides “mobile apps for remote access,” which small biz owners valuestellarone.io. Many user testimonials confirm they frequently use mobile – e.g., checking a dashboard before a meeting, or logging an expense right at the point of purchase. Performance on mobile is an expectation too: the app should be quick and not crash. There isn’t much tolerance for a poor mobile experience; if an official app is lacking, users will note it in reviews. Some ERP systems historically lagged in mobile support (SAP Business One has a mobile app but with limited functionality, and some older ERPs have none at all). That’s a disadvantage in the eyes of owners who might be on job sites or traveling – they often favor cloud-based solutions precisely for the anywhere access. As one user noted in praise of Dynamics 365 (Business Central), “everything is in the cloud which makes it great for a company with remote workers.”tipalti.com The same sentiment applies across tools: cloud access and good mobile apps are expected in 2025.


Offline Access and Backup: While cloud connectivity is assumed, users do bring up offline needs in certain cases. For example, a business in a rural area with spotty internet, or one that does on-site work (e.g., contractors) where connectivity can drop, may want at least partial offline functionality. This could mean a mobile app that stores data offline and syncs later, or a desktop program that can be used without internet. QuickBooks Desktop satisfied this for years (you only went online for updates or payroll tax tables, but entering expenses and bills didn’t require internet). With the shift to cloud, some users feel uneasy about being 100% dependent on internet uptime. Though not a super common complaint (since most places have decent connectivity), it’s an expectation in the back of users’ minds that they should be able to access their financial data anytime. If a system goes down or they go offline, they worry about being locked out. As a result, many will perform local backups (e.g., exporting data to Excel) as a failsafe. We saw an example with the Reddit user who, before closing their QuickBooks Online, tried to pull all the needed data to CSV because they weren’t confident they could get it laterreddit.com. So the expectation is either provide an offline mode or at least a straightforward way to download one’s data for safekeeping. Some software, like Xero, doesn’t have an official offline mode but allows exporting reports and data easily, which somewhat addresses this concern.


Automation and Workflow Efficiency: Small businesses might not use the term “workflow automation” often, but they certainly express the desire for the software to “do things automatically” so they don’t have to. This includes:


Recurring Transactions: Users expect that they can set up recurring bills (e.g. rent, utility payments) to be recorded on a schedule, or recurring journal entries, etc. Most modern systems have this, and it’s a liked feature.


Automated Categorization and Matching: As mentioned, bank feed rules that auto-tag expenses (like always categorize gas station transactions as fuel expense) are hugely important for saving time. QuickBooks users use bank rules extensively, but when the automation misfires (as one complained, mis-classifying items), it’s frustratingg2.com. The expectation is that these tools get “smarter” over time, perhaps using AI to learn patterns. Intuit has been adding more AI features (for example, receipt capture with machine learning to extract details). Users generally welcome these as long as they’re accurate.


Invoice/Bill Scanning: Many users now expect to simply scan or email a vendor invoice and have the system create a bill entry automatically via OCR. Third-party apps (Expensify, Receipt Bank, etc.) do this, and some ERPs have in-built capability or add-ons. If the core product doesn’t have it, users often mention it as a desired addition because it cuts down manual data entry of bills.


Approval Workflows: As companies approach 50 employees, some have an approval process for expenses or bills. They expect their system to support that (e.g., an automated notification to a manager for approval when an employee submits an expense report or when a new vendor bill over a certain amount is entered). If the software lacks an approval mechanism, users might point that out. Conversely, those that have it (e.g., some mid-tier ERPs) get praise for making it easier to enforce controls.


Reminders and Alerts: Users want automation in the form of reminders — for instance, an alert for a bill about to become overdue, or an automatic email to a vendor that payment was processed. These small automations are often assumed to exist; when they don’t, it can be a letdown.


In essence, the expectation in 2025 is that an ERP/accounting system for small business will integrate widely, be accessible from any device, and automate mundane bookkeeping tasks. If a product meets these expectations, users will highlight those positives (e.g. “I can access it from anywhere and it saves me hours on expense logging”). If it falls short, it will be dinged in reviews for feeling outdated or inconvenient.
Finally, a note on emerging expectations: As AI and machine learning become common, small business users are beginning to expect even more “smart” features. For example, some might anticipate predictive cash flow forecasting or anomaly detection (flagging an unusual expense automatically). We’re seeing the early stages of this in feedback – where once simply having online bank sync was a wow factor, now the bar is higher. The vendors that keep up with these integration and automation trends tend to enjoy better user feedback, while those that lag (or charge extra for basics) face the ire of the community.



