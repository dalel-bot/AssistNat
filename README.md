# 🤖 Assistant Téléphonique IA - Natech Training

Assistant téléphonique intelligent avec interface vocale interactive pour collecter les informations des prospects intéressés par les formations Natech Training.

## ✨ Fonctionnalités

### 🎙️ Interface Vocale Interactive
- **Bouton d'appel vert** : Démarre une conversation avec l'assistant IA
- **Bouton micro bleu** : Active la reconnaissance vocale pour répondre
- **Bouton raccrocher rouge** : Termine l'appel en cours

### 🗣️ Conversation Naturelle
L'assistant collecte automatiquement :
- ✅ Nom complet
- ✅ Numéro de téléphone  
- ✅ Adresse email
- ✅ Formation d'intérêt
- ✅ Message/questions
- ✅ Confirmation des informations

### 🇫🇷 Synthèse Vocale Française
- Prononciation française naturelle
- Hésitations occasionnelles pour paraître plus humain
- Débit de parole adapté pour une meilleure compréhension

### 🎯 Reconnaissance Vocale
- Reconnaissance vocale en français (fr-FR)
- Validation automatique des réponses
- Gestion des erreurs de compréhension

### 💾 Sauvegarde Automatique
- Stockage local des informations (localStorage)
- Historique complet des appelants
- Horodatage automatique des appels

## 🚀 Installation et Utilisation

### Prérequis
- Navigateur moderne (Chrome ou Edge recommandés)
- Microphone fonctionnel
- Connexion internet pour la synthèse vocale

### Lancement
1. Ouvrez `index.html` dans Chrome ou Edge
2. Autorisez l'accès au microphone quand demandé
3. Cliquez sur "📞 Démarrer l'appel"
4. Suivez les instructions de l'assistant

### Utilisation
1. **Démarrer** : Cliquez sur le bouton vert pour commencer
2. **Écouter** : L'assistant pose une question
3. **Répondre** : Cliquez sur le micro bleu et parlez
4. **Continuer** : Répétez jusqu'à la fin du questionnaire
5. **Confirmer** : Validez les informations collectées

## 🎯 Formations Natech Training

L'assistant fait référence aux formations disponibles sur :
**https://www.natech-training.com/**

Domaines de formation :
- 💻 Informatique et développement
- 📊 Gestion et management  
- 🌍 Langues étrangères
- 🎨 Design et créativité

## 🔧 Structure du Projet

```
Natassist/
├── index.html          # Interface principale
├── styles.css          # Styles et design
├── assistant.js        # Logique de l'assistant IA
└── README.md          # Documentation
```

## 🎨 Interface Utilisateur

### Statuts de l'Assistant
- 🟢 **Prêt** : En attente d'un appel
- 🟡 **Parle** : L'assistant s'exprime
- 🔵 **Écoute** : En attente de votre réponse
- 🔴 **Appel terminé** : Conversation finie

### Indicateurs Visuels
- Animation de pulsation pendant l'enregistrement
- Changement de couleur selon l'état
- Log de conversation en temps réel
- Affichage des données collectées

## 💾 Gestion des Données

### Stockage Local
- Utilise localStorage du navigateur
- Données persistantes entre les sessions
- Format JSON structuré

### Données Collectées
```json
{
  "nom": "Nom complet",
  "telephone": "Numéro de téléphone", 
  "email": "adresse@email.com",
  "formation": "Formation d'intérêt",
  "message": "Message ou questions",
  "timestamp": "Date et heure",
  "id": "Identifiant unique"
}
```

## 🔊 Compatibilité Vocale

### Navigateurs Supportés
- ✅ **Chrome** (recommandé)
- ✅ **Edge** (recommandé)  
- ⚠️ Firefox (limité)
- ❌ Safari (non supporté)

### APIs Utilisées
- `webkitSpeechRecognition` / `SpeechRecognition`
- `SpeechSynthesis` / `SpeechSynthesisUtterance`

## 🛠️ Personnalisation

### Modifier les Questions
Éditez le tableau `conversationSteps` dans `assistant.js` :

```javascript
{
    question: "Votre question personnalisée ?",
    field: "nom_du_champ",
    validation: (input) => input.length > 2
}
```

### Changer la Voix
Modifiez les paramètres dans la méthode `speak()` :

```javascript
utterance.rate = 0.9;    // Vitesse (0.1 à 10)
utterance.pitch = 1;     // Tonalité (0 à 2)
utterance.lang = 'fr-FR'; // Langue
```

## 🚨 Dépannage

### Problèmes Courants

**Micro ne fonctionne pas :**
- Vérifiez les permissions du navigateur
- Utilisez HTTPS ou localhost
- Testez avec Chrome/Edge

**Pas de voix française :**
- Installez un pack de langues Windows
- Redémarrez le navigateur
- Vérifiez les paramètres système

**Reconnaissance vocale défaillante :**
- Parlez clairement et distinctement
- Réduisez le bruit ambiant
- Vérifiez la qualité du microphone

## 📞 Support

Pour toute question technique ou suggestion d'amélioration, contactez l'équipe de développement Natech Training.

---

**Développé pour Natech Training** 🎓
*Formation professionnelle de qualité*