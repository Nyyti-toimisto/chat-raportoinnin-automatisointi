function Versions(): JSX.Element {
    const versions = window.electron?.process?.versions;

    if (!versions) {
        return <p>Virhe haettassa versionumeroita</p>;
    }

    return (
        <ul className="versions">
            <li className="electron-version">Electron v{versions.electron}</li>
            <li className="chrome-version">Chromium v{versions.chrome}</li>
            <li className="node-version">Node v{versions.node}</li>
            <li className="v8-version">V8 v{versions.v8}</li>
        </ul>
    );
}

export default Versions;
