import { useState, useEffect } from 'react';
import styles from './DatabaseBox.module.css';

function DatabaseBox() {
    const [dbLocation, setDbLocation] = useState<string>('');

    useEffect(() => {
        window.fileAPI.getDbLocation().then((location) => {
            setDbLocation(location);
        });
    }, []);

    function onClick() {
        window.fileAPI.changeDb().then((success) => {
            if (success) {
                window.fileAPI.getDbLocation().then((location) => {
                    setDbLocation(location);
                });
            }
        });
    }
    return (
        <div className={styles.box}>
            <h4>Tietokanta</h4>
            <p>Tietokannan sijainti</p>
            <div>
                <span>{dbLocation}</span>
                <button onClick={onClick}>Vaihda</button>
            </div>
        </div>
    );
}

export default DatabaseBox;
