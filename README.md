# 🎯 Arbitrage Calculator

Un calculateur d'arbitrage parfait pour paris sportifs, permettant de combiner freebets et cash pour obtenir un gain garanti.

## 🚀 Fonctionnalités

- **Calcul d'arbitrage parfait** : Répartition optimale des mises pour un gain garanti
- **Support des freebets** : Gestion des paris gratuits (gain net uniquement)
- **Support du cash** : Gestion des mises réelles (gain brut)
- **Interface moderne** : Design responsive avec TailwindCSS
- **Validation en temps réel** : Vérification des données saisies
- **Calculs précis** : Formules mathématiques optimisées

## 🛠️ Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation locale

1. **Cloner le repository**
   ```bash
   git clone <votre-repo>
   cd arbitrage-calculator
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint

## 🧮 Comment ça marche

### Principe de l'arbitrage

L'arbitrage parfait consiste à répartir vos mises sur les 3 issues possibles d'un match (victoire, nul, défaite) de manière à obtenir le même gain final, quel que soit le résultat.

### Formules utilisées

#### Pour les freebets
- Gain net = `Freebet × (Cote - 1)`
- Répartition optimale : `F1 = G / (C1 - 1)`, etc.
- Gain garanti : `G = freebet_total / ((C1 - 1)⁻¹ + (C2 - 1)⁻¹ + (C3 - 1)⁻¹)`

#### Pour le cash
- Gain brut = `Cash × Cote`
- Répartition optimale : `R1 = G / C1`, etc.
- Gain garanti : `G = cash_total / (1/C1 + 1/C2 + 1/C3)`

### Conditions d'arbitrage

Pour qu'un arbitrage soit possible :
```
1/C1 + 1/C2 + 1/C3 < 1
```

## 🎨 Technologies utilisées

- **Framework** : Next.js 14 avec App Router
- **Language** : TypeScript
- **Styling** : TailwindCSS
- **Déploiement** : Vercel (recommandé)

## 🚀 Déploiement

### Sur Vercel (recommandé)

1. **Connecter votre repository GitHub à Vercel**
2. **Configurer automatiquement** (Vercel détecte Next.js)
3. **Déployer** en un clic

### Sur d'autres plateformes

```bash
# Build de production
npm run build

# Démarrer le serveur
npm run start
```

## 📱 Utilisation

1. **Saisir les cotes** du match (victoire, nul, défaite)
2. **Définir les montants** disponibles (freebet et cash)
3. **Cliquer sur "Calculer l'arbitrage"**
4. **Consulter les résultats** :
   - Répartition optimale des freebets
   - Répartition optimale du cash
   - Gain garanti total
   - ROI (Return on Investment)

## 🔧 Structure du projet

```
arbitrage-calculator/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ArbitrageForm.tsx
│   │   └── ArbitrageResult.tsx
│   └── lib/
│       └── arbitrage.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ⚠️ Avertissement

Cet outil est destiné à des fins éducatives et de simulation. L'arbitrage sportif peut être réglementé dans certains pays. Assurez-vous de respecter la législation locale avant toute utilisation.

---

Développé avec ❤️ par [Votre nom] 