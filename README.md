## À propos du projet

Ce projet est une application web interactive permettant de visualiser en temps réel les données du réseau de transport public **Ametis**, qui gère les bus de la ville d'Amiens. Il affiche les arrêts de bus, la position des véhicules en circulation et met à jour ces informations dynamiquement.

### Sources des données

Les informations utilisées proviennent de [data.gouv.fr](https://transport.data.gouv.fr/datasets/ametis), où [Ametis](https://www.ametis.fr/) publie ses données de transport. Comme il n'existe pas d'API officielle pour y accéder directement, ces données sont récupérées en **scrapant** les fichiers disponibles afin d'extraire les informations nécessaires.

### Technologies utilisées

- **Frontend :** L'application repose sur **Leaflet** pour la cartographie interactive et JavaScript pour la gestion des données et de l'affichage.
- **Backend :** Un serveur **Node.js** avec **Express** gère les requêtes et le traitement des données.
- **Récupération des données :** **Axios** est utilisé pour interroger les sources externes et **Cheerio** permet d'effectuer le scraping des données depuis data.gouv.fr.
- **Fichiers statiques :** Certaines données, comme les arrêts sont stockées sous forme de fichiers JSON et GeoJSON.

### Fonctionnalités principales

- Affichage interactif de la carte avec la localisation des arrêts et la position en temps réel des bus.
- Mise à jour en direct de la position des véhicules.
- Scraping des données depuis data.gouv.fr pour récupérer les informations de transport.
- Possibilité d'afficher ou de masquer les arrêts.

### Objectifs du projet

Ce projet est avant tout une expérimentation visant à apprendre et à pratiquer des techniques telles que le scraping, l'utilisation de Node.js et la gestion des données en temps réel. L'objectif est de créer une application simple permettant de suivre la position des bus gérés par Ametis.

### Installation

Pour installer et exécuter le projet en local, suivez ces étapes :

```
git clone https://github.com/utilisateur/projet.git
```

```
cd projet
```

```
npm install
```

```
npm run start
```

Assurez-vous d'avoir **Node.js** (version recommandée : LTS) et **npm** installés sur votre machine avant de lancer l'application.
