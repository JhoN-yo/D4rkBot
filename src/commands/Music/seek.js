module.exports = {
    name: 'seek',
    description: 'Avança para um tempo específico da música',
    category: 'Musica',
    usage: '<Tempo>',
    guildOnly: true,
    cooldown: 5,
    args: 1,
    execute(client, message, args) {
        const player = client.music.players.get(message.guild.id);

        if (!player || !player.queue.current)
            return message.channel.send(':x: Não estou a tocar nada de momento!');

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel || (voiceChannel && voiceChannel.id !== player.voiceChannel))
            return message.channel.send(':x: Precisas de estar no meu canal de voz para usar esse comando!');

        function seek() { 
            let time = args[0];

            if (isNaN(time.replace(/:/g, '')))
                return message.channel.send(':x: Tempo inválido! Tente no formato `ss` ou `hh:mm:ss`');
    
            if (time.includes(':')) {
                const parts = time.split(':');
    
                if (parts.length > 3) {
                    return message.channel.send(`:x: O tempo tem de variar entre \`0 e ${player.queue.current.duration / 1000}\` segundos`)
                }
    
                time = 0;
                const len = parts.length
                for (let i = 0; i < len; i++) {
                    time += Number(parts.pop() * Math.pow(60, i));
                }
            }
    
            if (Number(time) < 0 || Number(time) * 1000 > player.queue.current.duration)
                return message.channel.send(`:x: O tempo tem de variar entre \`0 e ${player.queue.current.duration / 1000}\` segundos`)
    
            player.seek(time * 1000);
            message.channel.send(`<a:lab_verificado:643912897218740224> Tempo da música setado para \`${args[0]}\`.`);
        }

        if (message.guild.channels.cache.get(player.voiceChannel).members.size === 1 || (message.member.voice.channel && message.member.voice.channel.id === player.voiceChannel && message.member.voice.channel.members.filter(m => !m.user.bot).size === 1)) {
            seek();
        } else {
            const guild = message.guildDB;
            if (guild && guild.djrole) {
                const role = message.guild.roles.cache.get(guild.djrole);
                if (message.member.roles.cache.has(guild.djrole)) {
                    seek();
                }
                return message.channel.send(`:x: Precisas da permissão \`Mover Membros\` ou do cargo DJ: \`${role.name}\` para usar este comando!`);
            }
        }
    }
}