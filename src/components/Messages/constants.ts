import { MessageType } from './types';

export const MESSAGES: { type: MessageType; content: string }[][] = [
    [
        { type: 'sent', content: '<h1>Hey Scott</h1>' },
        { type: 'received', content: "Hey! I'm a little busy at the moment." },
        { type: 'received', content: 'Talk soon?' },
    ],
    [],
];
