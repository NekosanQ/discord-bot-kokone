import { Client, ClientEvents, Collection, CommandInteraction, GuildMember, Interaction, Message, VoiceState } from 'discord.js';
import { Command } from './commands/types/Command';

interface CustomCommand {
	execute(interaction: Interaction): Promise<void>;
    data: {
        name: string
    };
    execute(interaction: CommandInteraction): void;
};
interface Event<T extends keyof ClientEvents> {
    name: T;
    execute: (...args: ClientEvents[T]) => void;
    once?: boolean;
}
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, CustomCommand>;
    };
};