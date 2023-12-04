import styles from './customButton.module.css';

type CustomButtonProps = {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    role: 'invoke' | 'cancel' | 'submit';
};

export const CustomButton = (props: CustomButtonProps) => {
    return (
        <button onClick={props.onClick} className={styles[props.role]}>
            {props.text}
        </button>
    );
};
