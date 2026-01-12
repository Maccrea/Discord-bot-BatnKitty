require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const callSessions = new Map();
const LOG_CHANNEL_ID = '1456959703807561790'; 

const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID || ""; 
const JAM_YANG_MAU_DISET = parseInt(process.env.OFFSET_JAM || 0); 
const MENIT_YANG_MAU_DISET = parseInt(process.env.OFFSET_MENIT || 0); 
const DETIK_YANG_MAU_DISET = parseInt(process.env.OFFSET_DETIK || 0);

function getStartTime(channelId) {
    if (TARGET_CHANNEL_ID && channelId === TARGET_CHANNEL_ID) {
        
        const durasiMundur = (JAM_YANG_MAU_DISET * 60 * 60 * 1000) + 
                           (MENIT_YANG_MAU_DISET * 60 * 1000) + 
                           (DETIK_YANG_MAU_DISET * 1000);
        return Date.now() - durasiMundur;
        
    } else {
        return Date.now();
    }
}

client.on('ready', () => {
    console.log(`✅ Bot Logger berhasil login sebagai ${client.user.tag}!`);
    
    if (TARGET_CHANNEL_ID) {
        console.log(`🎯 Target Channel SET: ${TARGET_CHANNEL_ID} (Mundur ${JAM_YANG_MAU_DISET}j ${MENIT_YANG_MAU_DISET}m)`);
    } else {
        console.log(`ℹ️ Target Channel KOSONG. Semua berjalan normal.`);
    }

    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
            if (channel.isVoiceBased() && channel.members.size > 0) {
                
                const startTime = getStartTime(channel.id);

                if (!callSessions.has(channel.id)) {
                    if (TARGET_CHANNEL_ID && channel.id === TARGET_CHANNEL_ID) {
                        console.log(`⚠️ DETEKSI AWAL: Channel TARGET '${channel.name}' ditemukan aktif!`);
                    }
                    
                    callSessions.set(channel.id, { 
                        start: startTime, 
                        name: channel.name 
                    });
                }
            }
        });
    });

    setInterval(() => {
        if (callSessions.size > 0) {
            console.clear();
            console.log("========================================");
            console.log("      🔴 LIVE CALL MONITORING 🔴      ");
            console.log("========================================");
            
            callSessions.forEach((data, channelId) => {
                const currentDuration = Date.now() - data.start;
                console.log(`🔊 Room: ${data.name}`);
                console.log(`⏱️  Time: ${formatTimeDigital(currentDuration)}`);
                console.log("----------------------------------------");
            });
        }
    }, 1000);
});

client.on('voiceStateUpdate', (oldState, newState) => {

    const channel = newState.channel || oldState.channel;
    if (!channel) return;

    const channelId = channel.id;
    const membersCount = channel.members.size;

    if (membersCount > 0 && !callSessions.has(channelId)) {
        
        const startTime = getStartTime(channelId);
        
        if (TARGET_CHANNEL_ID && channelId === TARGET_CHANNEL_ID) {
            console.log(`⚠️ LIVE DETEKSI: Bot/User masuk ke Channel Target! Manipulasi waktu aktif.`);
        }

        callSessions.set(channelId, {
            start: startTime,
            name: channel.name
        });
    }

    if (membersCount === 0 && callSessions.has(channelId)) {
        const sessionData = callSessions.get(channelId);
        const startTime = sessionData.start;
        const endTime = Date.now();
        const durationMs = endTime - startTime;
        
        callSessions.delete(channelId);

        const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('📞 Call Session Ended')
                .setDescription(`Panggilan di voice channel telah selesai.`)
                .addFields(
                    { name: '🔊 Channel', value: sessionData.name, inline: true },
                    { name: '⏳ Durasi', value: `**${formatDuration(durationMs)}**`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'Voice Logger System', iconURL: client.user.displayAvatarURL() });

            logChannel.send({ embeds: [embed] });
        }
    }
});


function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    let str = "";
    if (hours > 0) str += `${hours} jam `;
    if (minutes > 0) str += `${minutes} menit `;
    str += `${seconds} detik`;
    return str.trim() || "0 detik";
}

function formatTimeDigital(ms) {
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hours = Math.floor(ms / (1000 * 60 * 60)).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

client.login(process.env.TOKEN);