'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Message } from './components/Message';
import { MESSAGES } from './constants';

export const Messages = () => {
    const [step, setStep] = useState(0);

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 2 } },
    };

    const sentItem = {
        hidden: {
            opacity: 0,
            y: 25,
            scale: 0.8,
            originX: 1,
            originY: 0,
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            originX: 1,
            originY: 0,
            transition: { ease: 'easeInOut' },
        },
    };

    const receivedItem = {
        hidden: {
            opacity: 0,
            y: 25,
            scale: 0.8,
            originX: 0,
            originY: 0,
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            originX: 0,
            originY: 0,
            transition: { ease: 'easeInOut' },
        },
    };

    return (
        <div className='overflow-x-hidden px-5 py-10'>
            <AnimatePresence>
                <motion.div
                    variants={container}
                    initial='hidden'
                    animate='show'
                >
                    {MESSAGES[step].map(({ type, content }, index) => {
                        const prevType = MESSAGES[step][index - 1]?.type;
                        return (
                            <motion.div
                                key={content}
                                variants={
                                    type === 'sent' ? sentItem : receivedItem
                                }
                            >
                                <Message
                                    type={type}
                                    prevType={prevType}
                                    content={content}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
