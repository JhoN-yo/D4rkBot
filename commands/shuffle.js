module.exports = {
    name: 'shuffle',
    description: 'Embaralha a lista de músicas',
    category: 'Musica',
    guildOnly: true,
    cooldown: 5,
    execute(client, message) {
        const player = client.music.players.get(message.guild.id);

        if (!player)
            return message.channel.send(':x: Não estou a tocar nada de momento!');

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) 
            return message.channel.send(':x: Precisas de estar num canal de voz para executar esse comando!');

        player.queue.shuffle();

        message.channel.send('<a:lab_verificado:643912897218740224> Lista de músicas embaralhada!');
    }
}