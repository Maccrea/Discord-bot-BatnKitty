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

client.on('ready', () => {
    console.log(`✅ Bot berhasil login sebagai ${client.user.tag}!`);

    const TARGET_CHANNEL_ID = '1448369229672742977'; 
    const JAM_YANG_MAU_DISET = 29; 
    const MENIT_YANG_MAU_DISET = 55; 
    const DETIK_YANG_MAU_DISET = 30;

    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
            if (channel.isVoiceBased() && channel.members.size > 0) {
                
                let startTime;

                if (channel.id === TARGET_CHANNEL_ID) {
                    console.log(`⚠️ MENGEMBALIKAN WAKTU UNTUK CHANNEL: ${channel.name}`);
                    
                    const durasiMundur = (JAM_YANG_MAU_DISET * 60 * 60 * 1000) + 
                                       (MENIT_YANG_MAU_DISET * 60 * 1000) + 
                                       (DETIK_YANG_MAU_DISET * 1000);
                    
                    startTime = Date.now() - durasiMundur;
                    
                } else {
                    startTime = Date.now();
                }

                if (!callSessions.has(channel.id)) {
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
    if (newState.member.user.bot) return;

    const channel = newState.channel || oldState.channel;
    if (!channel) return;

    const channelId = channel.id;
    const membersCount = channel.members.size;

    if (membersCount === 1 && !callSessions.has(channelId)) {
        callSessions.set(channelId, {
            start: Date.now(),
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