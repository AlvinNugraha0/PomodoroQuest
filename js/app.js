/**
 * Pomodoro Quest - JavaScript Logic
 * Features: Timer, Quest Log (To-Do), LocalStorage Persistence
 */

// ==================== STATE MANAGEMENT ====================
const AppState = {
    timer: {
        isRunning: false,
        mode: 'focus', // 'focus' or 'rest'
        remainingSeconds: 25 * 60,
        intervalId: null,
        endTime: null
    },
    settings: {
        focusDuration: 25,
        restDuration: 5
    },
    quests: [],
    distractions: [],
    totalFocusMinutes: 0
};

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
    QUESTS: 'pomodoro_quests',
    DISTRACTIONS: 'pomodoro_distractions',
    TOTAL_FOCUS: 'pomodoro_total_focus',
    SETTINGS: 'pomodoro_settings'
};

// ==================== DOM ELEMENTS ====================
let elements = {};

function initElements() {
    elements = {
        // Timer display
        timerDisplay: document.getElementById('timer-display'),
        timerStatus: document.getElementById('timer-status'),

        // Duration inputs
        focusInput: document.getElementById('focus-input'),
        restInput: document.getElementById('rest-input'),

        // Control buttons
        startWorkBtn: document.getElementById('start-work-btn'),
        restBtn: document.getElementById('rest-btn'),
        resetBtn: document.getElementById('reset-btn'),

        // Total focus display
        totalFocusDisplay: document.getElementById('total-focus'),

        // Quest elements
        questList: document.getElementById('quest-list'),
        questInput: document.getElementById('quest-input'),
        addQuestBtn: document.getElementById('add-quest-btn'),

        // Distraction elements
        distractionInput: document.getElementById('distraction-input'),
        addDistractionBtn: document.getElementById('add-distraction-btn'),
        distractionList: document.getElementById('distraction-list')
    };
}

// ==================== LOCAL STORAGE ====================
function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(AppState.quests));
    localStorage.setItem(STORAGE_KEYS.DISTRACTIONS, JSON.stringify(AppState.distractions));
    localStorage.setItem(STORAGE_KEYS.TOTAL_FOCUS, JSON.stringify(AppState.totalFocusMinutes));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(AppState.settings));
}

function loadFromStorage() {
    const savedQuests = localStorage.getItem(STORAGE_KEYS.QUESTS);
    const savedDistractions = localStorage.getItem(STORAGE_KEYS.DISTRACTIONS);
    const savedTotalFocus = localStorage.getItem(STORAGE_KEYS.TOTAL_FOCUS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedQuests) {
        AppState.quests = JSON.parse(savedQuests);
    }
    if (savedDistractions) {
        AppState.distractions = JSON.parse(savedDistractions);
    }
    if (savedTotalFocus) {
        AppState.totalFocusMinutes = JSON.parse(savedTotalFocus);
    }
    if (savedSettings) {
        AppState.settings = JSON.parse(savedSettings);
    }
}

// ==================== TIMER FUNCTIONS ====================
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = formatTime(AppState.timer.remainingSeconds);
}

function updateTimerStatus(message) {
    elements.timerStatus.textContent = message;
}

function startTimer() {
    if (AppState.timer.isRunning) return;

    AppState.timer.isRunning = true;
    updateTimerStatus(AppState.timer.mode === 'focus' ? 'FOCUS MODE ACTIVE' : 'REST MODE ACTIVE');

    // Add pulsing animation
    elements.timerDisplay.classList.add('animate-pulse');

    // Calculate end time based on current remaining seconds
    const now = Date.now();
    AppState.timer.endTime = now + (AppState.timer.remainingSeconds * 1000);

    AppState.timer.intervalId = setInterval(() => {
        const secondsLeft = Math.ceil((AppState.timer.endTime - Date.now()) / 1000);

        // Prevent negative values if slightly delayed
        AppState.timer.remainingSeconds = secondsLeft < 0 ? 0 : secondsLeft;

        updateTimerDisplay();

        if (AppState.timer.remainingSeconds <= 0) {
            timerComplete();
        }
    }, 200); // 200ms check for smoother updates and better responsiveness
}

function stopTimer() {
    if (AppState.timer.intervalId) {
        clearInterval(AppState.timer.intervalId);
        AppState.timer.intervalId = null;
    }
    AppState.timer.isRunning = false;
    elements.timerDisplay.classList.remove('animate-pulse');
}

function timerComplete() {
    stopTimer();

    // Play timer complete sound
    SoundEffects.timerComplete();

    if (AppState.timer.mode === 'focus') {
        // Add focus minutes to total
        AppState.totalFocusMinutes += AppState.settings.focusDuration;
        updateTotalFocusDisplay();
        saveToStorage();

        updateTimerStatus('QUEST COMPLETE! TIME TO REST');
        showNotification('Focus Session Complete!', 'Great job! Take a break.');
    } else {
        updateTimerStatus('BREAK OVER! READY FOR NEW QUEST');
        showNotification('Break Over!', 'Ready to focus again?');
    }
}

function startFocusMode() {
    stopTimer();

    // Play start work sound
    SoundEffects.startWork();

    // Update settings from input
    const focusValue = parseInt(elements.focusInput.value) || 25;
    AppState.settings.focusDuration = focusValue;

    AppState.timer.mode = 'focus';
    AppState.timer.remainingSeconds = focusValue * 60;

    updateTimerDisplay();
    saveToStorage();
    startTimer();
}

function startRestMode() {
    stopTimer();

    // Play start rest sound
    SoundEffects.startRest();

    // Update settings from input
    const restValue = parseInt(elements.restInput.value) || 5;
    AppState.settings.restDuration = restValue;

    AppState.timer.mode = 'rest';
    AppState.timer.remainingSeconds = restValue * 60;

    updateTimerDisplay();
    saveToStorage();
    startTimer();
}

function resetSystem() {
    stopTimer();

    // Play reset sound
    SoundEffects.reset();

    AppState.timer.mode = 'focus';
    AppState.timer.remainingSeconds = AppState.settings.focusDuration * 60;

    updateTimerDisplay();
    updateTimerStatus('PRESS START TO BEGIN QUEST');
}

// ==================== RETRO SOUND EFFECTS ====================
const SoundEffects = {
    audioContext: null,

    // Initialize audio context (must be called after user interaction)
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },

    // Play a note with given frequency, duration, and wave type
    playNote(frequency, duration, type = 'square', volume = 0.3) {
        try {
            const ctx = this.init();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log('Audio not supported');
        }
    },

    // Play a sequence of notes
    playSequence(notes) {
        try {
            const ctx = this.init();
            let time = ctx.currentTime;

            notes.forEach(note => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = note.type || 'square';
                oscillator.frequency.value = note.freq;

                gainNode.gain.setValueAtTime(note.volume || 0.3, time);
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);

                oscillator.start(time);
                oscillator.stop(time + note.duration);

                time += note.duration;
            });
        } catch (e) {
            console.log('Audio not supported');
        }
    },

    // ===== SOUND EFFECT FUNCTIONS =====

    // Quest completed - Victory fanfare (ascending notes)
    questComplete() {
        this.playSequence([
            { freq: 523, duration: 0.1 },  // C5
            { freq: 659, duration: 0.1 },  // E5
            { freq: 784, duration: 0.1 },  // G5
            { freq: 1047, duration: 0.3 }, // C6
        ]);
    },

    // Quest unchecked
    questUncomplete() {
        this.playSequence([
            { freq: 400, duration: 0.1 },
            { freq: 300, duration: 0.15 },
        ]);
    },

    // Add new item - Short blip
    addItem() {
        this.playSequence([
            { freq: 800, duration: 0.05 },
            { freq: 1200, duration: 0.08 },
        ]);
    },

    // Delete item - Descending error sound
    deleteItem() {
        this.playSequence([
            { freq: 400, duration: 0.08 },
            { freq: 300, duration: 0.08 },
            { freq: 200, duration: 0.1 },
        ]);
    },

    // Start work - Energetic power up sound
    startWork() {
        this.playSequence([
            { freq: 262, duration: 0.1 },  // C4
            { freq: 330, duration: 0.1 },  // E4
            { freq: 392, duration: 0.1 },  // G4
            { freq: 523, duration: 0.15 }, // C5
        ]);
    },

    // Start rest - Calm/relaxing sound
    startRest() {
        this.playSequence([
            { freq: 392, duration: 0.15 },  // G4
            { freq: 330, duration: 0.15 },  // E4
            { freq: 262, duration: 0.2 },   // C4 (longer, calming)
        ]);
    },

    // Timer complete - Victory melody
    timerComplete() {
        this.playSequence([
            { freq: 523, duration: 0.15 },  // C5
            { freq: 523, duration: 0.15 },  // C5
            { freq: 523, duration: 0.15 },  // C5
            { freq: 415, duration: 0.4 },   // Ab4
            { freq: 466, duration: 0.15 },  // Bb4
            { freq: 466, duration: 0.15 },  // Bb4
            { freq: 466, duration: 0.15 },  // Bb4
            { freq: 415, duration: 0.4 },   // Ab4
        ]);
    },

    // Button click - Simple click
    click() {
        this.playNote(800, 0.05, 'square', 0.15);
    },

    // Toggle distraction crossed
    toggleCross() {
        this.playNote(600, 0.08, 'square', 0.2);
    },

    // Reset system
    reset() {
        this.playSequence([
            { freq: 500, duration: 0.1 },
            { freq: 400, duration: 0.1 },
            { freq: 300, duration: 0.15 },
        ]);
    }
};

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '🍅' });
    }
}

// ==================== QUEST (TO-DO) FUNCTIONS ====================
function generateQuestId() {
    return 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function addQuest(title) {
    const quest = {
        id: generateQuestId(),
        title: title,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString()
    };

    AppState.quests.push(quest);
    saveToStorage();
    renderQuests();

    // Play add item sound
    SoundEffects.addItem();
}

function toggleQuestComplete(questId, animate = true) {
    const quest = AppState.quests.find(q => q.id === questId);
    if (quest) {
        const wasCompleted = quest.completed;
        quest.completed = !quest.completed;
        quest.progress = quest.completed ? 100 : 0;
        saveToStorage();
        renderQuests(animate && !wasCompleted ? questId : null);

        // Play appropriate sound
        if (quest.completed) {
            SoundEffects.questComplete();
        } else {
            SoundEffects.questUncomplete();
        }
    }
}

function deleteQuest(questId) {
    AppState.quests = AppState.quests.filter(q => q.id !== questId);
    saveToStorage();
    renderQuests();

    // Play delete sound
    SoundEffects.deleteItem();
}

function updateQuestProgress(questId, progress) {
    const quest = AppState.quests.find(q => q.id === questId);
    if (quest) {
        quest.progress = Math.min(100, Math.max(0, progress));
        quest.completed = quest.progress === 100;
        saveToStorage();
        renderQuests();
    }
}

function renderQuests(animateQuestId = null) {
    elements.questList.innerHTML = '';

    AppState.quests.forEach(quest => {
        const li = document.createElement('li');
        li.className = 'group flex items-start gap-3 cursor-pointer';

        // Determine progress bar classes
        const shouldAnimate = animateQuestId === quest.id;
        const progressClasses = shouldAnimate
            ? 'quest-progress-bar quest-progress-animate'
            : 'quest-progress-bar';
        const progressColor = quest.completed ? 'bg-green-500' : 'bg-primary';
        const progressWidth = shouldAnimate ? '0%' : `${quest.progress}%`;

        li.innerHTML = `
            <div class="quest-checkbox w-6 h-6 border-2 border-gray-400 dark:border-retro-border flex items-center justify-center bg-gray-100 dark:bg-black/20 group-hover:border-primary transition-colors" data-id="${quest.id}">
                <span class="material-icons text-base ${quest.completed ? 'text-green-500' : 'opacity-0 group-hover:opacity-50'}"}>check</span>
            </div>
            <div class="flex-1">
                <div class="flex items-start justify-between">
                    <p class="text-lg leading-tight pt-1 break-words break-all mr-2 ${quest.completed ? 'line-through opacity-50' : ''}">${escapeHtml(quest.title)}</p>
                    <button class="delete-quest-btn opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity flex-shrink-0 mt-1" data-id="${quest.id}">
                        <span class="material-icons text-sm">close</span>
                    </button>
                </div>
                <div class="w-full bg-gray-200 dark:bg-black/30 h-2 mt-2 rounded-none overflow-hidden">
                    <div class="h-full ${progressClasses} ${shouldAnimate ? '' : progressColor}" style="width: ${progressWidth}"></div>
                </div>
            </div>
        `;

        // Add click event for checkbox
        const checkbox = li.querySelector('.quest-checkbox');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleQuestComplete(quest.id);
        });

        // Add click event for delete button
        const deleteBtn = li.querySelector('.delete-quest-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteQuest(quest.id);
        });

        elements.questList.appendChild(li);
    });
}

// ==================== DISTRACTION FUNCTIONS ====================
function generateDistractionId() {
    return 'distraction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function addDistraction(text) {
    const distraction = {
        id: generateDistractionId(),
        text: text,
        crossed: false,
        createdAt: new Date().toISOString()
    };

    AppState.distractions.push(distraction);
    saveToStorage();
    renderDistractions();

    // Play add item sound
    SoundEffects.addItem();
}

function toggleDistractionCrossed(distractionId) {
    const distraction = AppState.distractions.find(d => d.id === distractionId);
    if (distraction) {
        distraction.crossed = !distraction.crossed;
        saveToStorage();
        renderDistractions();

        // Play toggle sound
        SoundEffects.toggleCross();
    }
}

function deleteDistraction(distractionId) {
    AppState.distractions = AppState.distractions.filter(d => d.id !== distractionId);
    saveToStorage();
    renderDistractions();

    // Play delete sound
    SoundEffects.deleteItem();
}

function renderDistractions() {
    elements.distractionList.innerHTML = '';

    AppState.distractions.forEach(distraction => {
        const li = document.createElement('li');
        li.className = 'group flex items-start gap-2'; // Changed to items-start for multiline support
        li.innerHTML = `
            <span class="w-2 h-2 ${distraction.crossed ? 'bg-red-500' : 'bg-primary'} block flex-shrink-0 mt-2"></span>
            <span class="distraction-text flex-1 cursor-pointer hover:opacity-80 transition-opacity break-words break-all ${distraction.crossed ? 'line-through decoration-2 opacity-50' : ''}" data-id="${distraction.id}">${escapeHtml(distraction.text)}</span>
            <button class="delete-distraction-btn opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity flex-shrink-0 mt-1" data-id="${distraction.id}">
                <span class="material-icons text-sm">close</span>
            </button>
        `;

        // Add click event for toggle strikethrough
        const textSpan = li.querySelector('.distraction-text');
        textSpan.addEventListener('click', () => {
            toggleDistractionCrossed(distraction.id);
        });

        // Add click event for delete button
        const deleteBtn = li.querySelector('.delete-distraction-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteDistraction(distraction.id);
        });

        elements.distractionList.appendChild(li);
    });
}

// ==================== DISPLAY UPDATES ====================
function updateTotalFocusDisplay() {
    elements.totalFocusDisplay.textContent = AppState.totalFocusMinutes;
}

function syncSettingsToInputs() {
    elements.focusInput.value = AppState.settings.focusDuration;
    elements.restInput.value = AppState.settings.restDuration;

    // Update timer display to match focus duration
    if (!AppState.timer.isRunning) {
        AppState.timer.remainingSeconds = AppState.settings.focusDuration * 60;
        updateTimerDisplay();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Timer control buttons
    elements.startWorkBtn.addEventListener('click', startFocusMode);
    elements.restBtn.addEventListener('click', startRestMode);
    elements.resetBtn.addEventListener('click', resetSystem);

    // Add quest button and input
    elements.addQuestBtn.addEventListener('click', () => {
        const title = elements.questInput.value.trim();
        if (title) {
            addQuest(title);
            elements.questInput.value = '';
        }
    });

    // Add quest on Enter key
    elements.questInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const title = elements.questInput.value.trim();
            if (title) {
                addQuest(title);
                elements.questInput.value = '';
            }
        }
    });

    // Settings inputs - save on change
    elements.focusInput.addEventListener('change', () => {
        AppState.settings.focusDuration = parseInt(elements.focusInput.value) || 25;
        saveToStorage();
        if (!AppState.timer.isRunning && AppState.timer.mode === 'focus') {
            AppState.timer.remainingSeconds = AppState.settings.focusDuration * 60;
            updateTimerDisplay();
        }
    });

    elements.restInput.addEventListener('change', () => {
        AppState.settings.restDuration = parseInt(elements.restInput.value) || 5;
        saveToStorage();
        if (!AppState.timer.isRunning && AppState.timer.mode === 'rest') {
            AppState.timer.remainingSeconds = AppState.settings.restDuration * 60;
            updateTimerDisplay();
        }
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        elements.startWorkBtn.addEventListener('click', () => {
            Notification.requestPermission();
        }, { once: true });
    }

    // Add distraction button
    elements.addDistractionBtn.addEventListener('click', () => {
        const text = elements.distractionInput.value.trim();
        if (text) {
            addDistraction(text);
            elements.distractionInput.value = '';
        }
    });

    // Add distraction on Enter key
    elements.distractionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = elements.distractionInput.value.trim();
            if (text) {
                addDistraction(text);
                elements.distractionInput.value = '';
            }
        }
    });
}

// ==================== INITIALIZATION ====================
function init() {
    initElements();
    loadFromStorage();
    syncSettingsToInputs();
    updateTotalFocusDisplay();
    renderQuests();
    renderDistractions();
    setupEventListeners();

    // Set initial timer display
    updateTimerDisplay();

    console.log('🍅 Pomodoro Quest initialized!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
