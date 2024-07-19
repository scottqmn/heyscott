import clsx from 'clsx';

import styles from './Message.module.scss';
import { MessageType } from '../../types';

type MessageProps = {
    content: string;
    type: MessageType;
    prevType?: MessageType;
};

export const Message: React.FC<MessageProps> = ({
    content,
    type,
    prevType,
}) => {
    const isTyping = type === 'typing';
    const Tag = isTyping ? 'button' : 'div';

    return (
        <div
            className={clsx(
                'mx-auto flex max-w-sm flex-col md:max-w-md lg:max-w-lg',
                type === prevType ? 'mt-1' : 'mt-4',
                { '!mt-0': !prevType }
            )}
        >
            <Tag
                className={clsx(styles.bubble, styles[type])}
                role={isTyping ? 'button' : undefined}
            >
                <div className='min-h-4 min-w-8'>
                    {isTyping ? (
                        <div className={styles.dots}>
                            <div className='fade-in-out' />
                            <div className='fade-in-out' />
                            <div className='fade-in-out' />
                        </div>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                </div>
            </Tag>
        </div>
    );
};
