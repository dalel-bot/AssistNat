class AIPhoneAssistant {
    constructor() {
        this.isCallActive = false;
        this.currentStep = 0;
        this.callerData = {};
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        
        this.conversationSteps = [
            {
                question: "Bonjour ! Bienvenue chez Natech Training. Je suis votre assistant virtuel. Pouvez-vous me dire votre nom complet, s'il vous plaît ?",
                field: "nom",
                validation: (input) => input.length > 2
            },
            {
                question: "Parfait ! Maintenant, pourriez-vous me donner votre numéro de téléphone ?",
                field: "telephone",
                validation: (input) => /\d{8,}/.test(input.replace(/\s/g, ''))
            },
            {
                question: "Très bien ! Et... votre adresse email, s'il vous plaît ? Dites par exemple : jean point martin arobase gmail point com",
                field: "email",
                validation: (input) => {
                    // Convertir la dictée en email
                    let email = input.toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/point/g, '.')
                        .replace(/arobase|arrobase|at/g, '@')
                        .replace(/tiret/g, '-')
                        .replace(/underscore|souligné/g, '_');
                    
                    // Sauvegarder l'email formaté
                    if (/\S+@\S+\.\S+/.test(email)) {
                        this.callerData.email = email;
                        return true;
                    }
                    return false;
                }
            },
            {
                question: "Excellent ! Alors... quelle formation vous intéresse chez Natech Training ? Nous proposons : Construction Métallique et Soudage, Industrie et Maintenance, Sécurité Électronique et Domotique, Santé et Sécurité au Travail, Sécurité et Sûreté Physique, Construction Bâtiments, ou Logiciels de Conception...",
                field: "formation",
                validation: (input) => input.length > 3
            },
            {
                question: "Parfait ! Avez-vous un message particulier ou des questions sur cette formation ?",
                field: "message",
                validation: (input) => true
            }
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.loadCallersFromStorage();
    }

    initializeElements() {
        this.callBtn = document.getElementById('call-btn');
        this.micBtn = document.getElementById('mic-btn');
        this.endCallBtn = document.getElementById('end-call-btn');
        this.status = document.getElementById('status');
        this.conversationLog = document.getElementById('conversation-log');
        this.callerInfo = document.getElementById('caller-info');
        this.collectedData = document.getElementById('collected-data');
        this.callersList = document.getElementById('callers-list');
        this.clearDataBtn = document.getElementById('clear-data-btn');
        this.exportExcelBtn = document.getElementById('export-excel-btn');
    }

    setupEventListeners() {
        this.callBtn.addEventListener('click', () => this.startCall());
        this.micBtn.addEventListener('click', () => this.toggleListening());
        this.endCallBtn.addEventListener('click', () => this.endCall());
        this.clearDataBtn.addEventListener('click', () => this.clearAllData());
        this.exportExcelBtn.addEventListener('click', () => this.exportToExcel());
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        }

        if (this.recognition) {
            this.recognition.lang = 'fr-FR';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
            
            // Forcer le mode local si possible
            if (this.recognition.serviceURI) {
                this.recognition.serviceURI = '';
            }

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserResponse(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Erreur de reconnaissance vocale:', event.error);
                if (event.error === 'network') {
                    this.updateStatus('ERREUR: Utilisez chrome_fix.bat pour résoudre');
                    alert('Erreur network: Fermez Chrome et utilisez chrome_fix.bat');
                } else if (event.error === 'not-allowed') {
                    this.updateStatus('Microphone non autorisé. Autorisez l\'accès.');
                } else {
                    this.updateStatus('Erreur reconnaissance vocale: ' + event.error);
                }
                this.micBtn.disabled = false;
                this.micBtn.classList.remove('recording');
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.micBtn.disabled = false;
                this.micBtn.classList.remove('recording');
            };
        }
    }

    startCall() {
        this.isCallActive = true;
        this.currentStep = 0;
        this.callerData = {};
        
        this.callBtn.disabled = true;
        this.endCallBtn.disabled = false;
        
        this.updateStatus('Appel en cours...');
        this.clearConversationLog();
        this.callerInfo.style.display = 'none';
        
        setTimeout(() => {
            this.askCurrentQuestion();
        }, 2000);
    }

    askCurrentQuestion() {
        if (this.currentStep < this.conversationSteps.length) {
            const step = this.conversationSteps[this.currentStep];
            this.speak(step.question);
            this.addToConversationLog('Assistant', step.question);
        } else {
            this.confirmInformation();
        }
    }

    speak(text) {
        // Arrêter toute synthèse en cours
        this.synthesis.cancel();
        
        this.isSpeaking = true;
        this.micBtn.disabled = true;
        this.updateStatus('L\'assistant parle...');
        this.status.classList.add('speaking');

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        utterance.lang = 'fr-FR';
        
        // Chercher une voix française naturelle
        const voices = this.synthesis.getVoices();
        const naturalVoice = voices.find(voice => 
            voice.lang.startsWith('fr') && 
            (voice.name.includes('Hortense') || 
             voice.name.includes('Julie') ||
             voice.name.includes('Natural') ||
             voice.name.includes('Neural'))
        ) || voices.find(voice => voice.lang.startsWith('fr'));
        
        if (naturalVoice) {
            utterance.voice = naturalVoice;
            console.log('Voix utilisée:', naturalVoice.name);
        }
        utterance.lang = 'fr-FR';

        utterance.onend = () => {
            this.isSpeaking = false;
            this.status.classList.remove('speaking');
            if (this.isCallActive) {
                this.micBtn.disabled = false;
                this.updateStatus('Cliquez sur le micro pour répondre');
            }
        };

        utterance.onerror = () => {
            this.isSpeaking = false;
            this.status.classList.remove('speaking');
            if (this.isCallActive) {
                this.micBtn.disabled = false;
                this.updateStatus('Cliquez sur le micro pour répondre');
            }
        };

        this.synthesis.speak(utterance);
    }

    toggleListening() {
        if (!this.recognition) {
            alert('Reconnaissance vocale non supportée sur cet appareil.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.isListening = true;
            this.micBtn.disabled = true;
            this.micBtn.classList.add('recording');
            this.updateStatus('Écoute en cours... Parlez maintenant');
            this.recognition.start();
        }
    }

    handleUserResponse(transcript) {
        this.addToConversationLog('Vous', transcript);
        
        if (this.currentStep < this.conversationSteps.length) {
            const step = this.conversationSteps[this.currentStep];
            
            if (step.validation(transcript)) {
                this.callerData[step.field] = transcript;
                this.updateCollectedData();
                this.currentStep++;
                
                setTimeout(() => {
                    this.askCurrentQuestion();
                }, 1500);
            } else {
                setTimeout(() => {
                    let errorMsg = "Désolé, je n'ai pas bien compris.";
                    if (step.field === 'email') {
                        errorMsg = "Pour l'email, dites par exemple : jean point martin arobase gmail point com. Pouvez-vous répéter ?";
                    } else {
                        errorMsg = "Pouvez-vous répéter, s'il vous plaît ?";
                    }
                    this.speak(errorMsg);
                    this.addToConversationLog('Assistant', errorMsg);
                }, 1000);
            }
        } else {
            this.handleConfirmationResponse(transcript);
        }
    }

    confirmInformation() {
        const confirmationText = `Parfait ! Laissez-moi confirmer vos informations : 
        Nom : ${this.callerData.nom}, 
        Téléphone : ${this.callerData.telephone}, 
        Email : ${this.callerData.email}, 
        Formation d'intérêt : ${this.callerData.formation}, 
        Message : ${this.callerData.message}. 
        Ces informations sont-elles correctes ? Dites "oui" pour confirmer ou "non" pour recommencer.`;
        
        this.speak(confirmationText);
        this.addToConversationLog('Assistant', confirmationText);
    }

    handleConfirmationResponse(transcript) {
        const response = transcript.toLowerCase();
        
        if (response.includes('oui') || response.includes('correct') || response.includes('exacte') || response.includes('d\'accord')) {
            this.saveCallerData();
            const thankYouMessage = "Excellent ! Vos informations ont été enregistrées. Un conseiller de Natech Training vous contactera bientôt. Merci de votre appel et... à bientôt !";
            this.speak(thankYouMessage);
            this.addToConversationLog('Assistant', thankYouMessage);
            
            setTimeout(() => {
                this.endCall();
            }, 10000);
        } else if (response.includes('non') || response.includes('recommencer') || response.includes('faux')) {
            this.currentStep = 0;
            this.callerData = {};
            this.updateCollectedData();
            const restartMessage = "D'accord, recommençons depuis le début.";
            this.speak(restartMessage);
            this.addToConversationLog('Assistant', restartMessage);
            
            setTimeout(() => {
                this.askCurrentQuestion();
            }, 3000);
        } else {
            const clarificationMessage = "Je n'ai pas bien compris. Dites 'oui' si les informations sont correctes ou 'non' pour recommencer.";
            this.speak(clarificationMessage);
            this.addToConversationLog('Assistant', clarificationMessage);
        }
    }

    saveCallerData() {
        const callerRecord = {
            ...this.callerData,
            timestamp: new Date().toLocaleString('fr-FR'),
            id: Date.now()
        };

        let callers = JSON.parse(localStorage.getItem('natechCallers') || '[]');
        callers.push(callerRecord);
        localStorage.setItem('natechCallers', JSON.stringify(callers));
        
        this.loadCallersFromStorage();
    }

    loadCallersFromStorage() {
        const callers = JSON.parse(localStorage.getItem('natechCallers') || '[]');
        this.displayCallers(callers);
    }

    displayCallers(callers) {
        this.callersList.innerHTML = '';
        
        if (callers.length === 0) {
            this.callersList.innerHTML = '<p style="text-align: center; color: #718096;">Aucun appelant enregistré</p>';
            return;
        }

        callers.reverse().forEach(caller => {
            const callerDiv = document.createElement('div');
            callerDiv.className = 'caller-record';
            callerDiv.innerHTML = `
                <h4>${caller.nom}</h4>
                <p><strong>Téléphone:</strong> ${caller.telephone}</p>
                <p><strong>Email:</strong> ${caller.email}</p>
                <p><strong>Formation:</strong> ${caller.formation}</p>
                <p><strong>Message:</strong> ${caller.message}</p>
                <p><strong>Date:</strong> ${caller.timestamp}</p>
            `;
            this.callersList.appendChild(callerDiv);
        });
    }

    exportToExcel() {
        const callers = JSON.parse(localStorage.getItem('natechCallers') || '[]');
        
        if (callers.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Créer le contenu CSV
        let csvContent = 'Nom,Téléphone,Email,Formation,Message,Date\n';
        
        callers.forEach(caller => {
            const row = [
                `"${caller.nom || ''}",`,
                `"${caller.telephone || ''}",`,
                `"${caller.email || ''}",`,
                `"${caller.formation || ''}",`,
                `"${caller.message || ''}",`,
                `"${caller.timestamp || ''}"`
            ].join('');
            csvContent += row + '\n';
        });

        // Télécharger le fichier
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `natech_appelants_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Export réussi ! ${callers.length} appelants exportés.`);
    }

    clearAllData() {
        if (confirm('Êtes-vous sûr de vouloir effacer toutes les données des appelants ?')) {
            localStorage.removeItem('natechCallers');
            this.loadCallersFromStorage();
        }
    }

    updateCollectedData() {
        let dataHtml = '';
        Object.keys(this.callerData).forEach(key => {
            const label = {
                nom: 'Nom complet',
                telephone: 'Téléphone',
                email: 'Email',
                formation: 'Formation',
                message: 'Message'
            }[key] || key;
            
            dataHtml += `<p><strong>${label}:</strong> ${this.callerData[key]}</p>`;
        });
        
        this.collectedData.innerHTML = dataHtml;
        this.callerInfo.style.display = Object.keys(this.callerData).length > 0 ? 'block' : 'none';
    }

    addToConversationLog(speaker, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-item ${speaker === 'Assistant' ? 'assistant-message' : 'user-message'}`;
        messageDiv.innerHTML = `<strong>${speaker}:</strong> ${message}`;
        this.conversationLog.appendChild(messageDiv);
        this.conversationLog.scrollTop = this.conversationLog.scrollHeight;
    }

    clearConversationLog() {
        this.conversationLog.innerHTML = '';
    }

    updateStatus(message) {
        this.status.textContent = message;
    }

    endCall() {
        this.isCallActive = false;
        this.currentStep = 0;
        
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        
        this.callBtn.disabled = false;
        this.micBtn.disabled = true;
        this.endCallBtn.disabled = true;
        this.micBtn.classList.remove('recording');
        this.status.classList.remove('speaking');
        
        this.updateStatus('Appel terminé. Prêt pour un nouvel appel.');
    }
}

// Initialiser l'assistant quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.assistant = new AIPhoneAssistant();
    }, 500);
});

// Gérer la fermeture de la page
window.addEventListener('beforeunload', (event) => {
    if (window.assistant && window.assistant.isCallActive) {
        event.preventDefault();
        event.returnValue = 'Un appel est en cours. Êtes-vous sûr de vouloir quitter ?';
    }
});