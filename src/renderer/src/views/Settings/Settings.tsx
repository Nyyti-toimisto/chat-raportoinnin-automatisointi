import DatabaseBox from '@renderer/components/DatabaseBox/DatabaseBox';
import Versions from '@renderer/components/Versions';

function Settings() {
    return (
        <div>
            <Versions></Versions>
            <DatabaseBox></DatabaseBox>
        </div>
    );
}

export default Settings;
