let fieldData;

const soundPlayer = document.getElementById('sound');

// Prüft die Berechtigungen für das Kommando (falls nötig)
const checkPrivileges = (data, privileges) => {
    const { tags, userId } = data;
    const { mod, subscriber, badges } = tags;
    const required = privileges || fieldData.privileges;
    const isMod = parseInt(mod);
    const isSub = parseInt(subscriber);
    const isVip = badges.includes("vip");
    const isBroadcaster = (userId === tags['room-id']);

    if (isBroadcaster) return true;
    if (required === "justSubs" && isSub) return true;
    if (required === "mods" && isMod) return true;
    if (required === "vips" && (isMod || isVip)) return true;
    if (required === "subs" && (isMod || isVip || isSub)) return true;
    return required === "everybody";
};

// Behandelt eingehende Chat-Kommandos
const handleMessage = (obj) => {
    const data = obj.detail.event.data;

    if (!checkPrivileges(data)) {
        return;
    }

    const { commands } = fieldData; // JSON-Mapping der Kommandos zu Sounds
    const { text } = data;

    // Suche nach einem passenden Kommando im Mapping
    const command = Object.keys(commands).find(cmd =>
        text.toLowerCase().startsWith(cmd.toLowerCase())
    );

    if (command) {
        const soundFile = commands[command];
        playSound(soundFile);
    }
};

// Spielt einen Sound ab
const playSound = (soundFile) => {
    soundPlayer.src = soundFile;
    soundPlayer.play();
};

// Initialisiert die Widget-Funktionalität
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;

    // Setze die Lautstärke des Sounds
    const { volume } = fieldData;
    soundPlayer.volume = volume;
});

// Lauscht auf Chat-Nachrichten
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") {
        return;
    }
    handleMessage(obj);
});
