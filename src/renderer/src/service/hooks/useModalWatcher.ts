import { useEffect, Dispatch, SetStateAction } from 'react';

export const useModalWatcher = (
    ref: React.RefObject<HTMLElement>,
    ...states: Dispatch<SetStateAction<boolean>>[]
) => {
    const stateCloser = () => {
        states.forEach((setState) => {
            setState(false);
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as HTMLElement) &&
                !(<HTMLElement>event.target).className.startsWith('ant')
            ) {
                states.forEach((setState) => {
                    setState(false);
                });
            }
        };
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                states.forEach((setState) => {
                    setState(false);
                });
            }
        };

        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('keydown', handleEsc, true);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [ref, states]);

    return { stateCloser } as const;
};
