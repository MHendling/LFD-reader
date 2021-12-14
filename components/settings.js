import React, {useState} from 'react'
import {Button, Classes, Dialog, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import ParameterForm from "./parameterForm";

import styles from './settings.module.css';

const Settings = (props) => {
    const {currentSettings, onChange} = props;
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState([{id: 'Default', a: 1, b: 2, c: 3, d: 4}]);

    const handleCloseSettings = () => setSettingsOpen(false);

    const handleChangeSettings = (event) => {
        const currentSettings = settings.find(setting => setting.id === event.target.value);
        onChange(currentSettings);
    }

    return (
        <div className={styles.settings}>
            <select defaultValue=""
                    value={currentSettings?.id}
                    onChange={handleChangeSettings}>
                <option disabled defaultValue value="">Please select settings</option>
                {settings.map((setting) => <option value={setting.id} key={setting.id}>
                    {setting.id}
                </option>)}
            </select>

            <Button outlined small intent={Intent.SUCCESS} icon="plus"
                    onClick={() => setSettingsOpen(true)}>
                Add new setting
            </Button>

            {currentSettings != null &&
            <div className={styles.currentSettings}>
                <span>Id</span>
                <span>{currentSettings?.id}</span>

                <span>a</span>
                <span>{currentSettings?.a}</span>

                <span>b</span>
                <span>{currentSettings?.b}</span>

                <span>c</span>
                <span>{currentSettings?.c}</span>

                <span>d</span>
                <span>{currentSettings?.d}</span>
            </div>
            }

            <Dialog isOpen={settingsOpen} onClose={handleCloseSettings} className={styles.dialog}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={true}>
                <div className={classNames(Classes.DIALOG_HEADER, styles.dialogHeader)}>
                    <h3>Add new setting</h3>
                    <Button className={Classes.DIALOG_CLOSE_BUTTON} icon="cross"
                            onClick={handleCloseSettings}/></div>
                <div className={Classes.DIALOG_BODY}>
                    <ParameterForm onSubmit={(data) => {
                        // clone our state settings, we never want to manipulate state directly
                        // or js will shoot at you
                        // pew pew pew
                        const clonedSettings = Array.from(settings);
                        clonedSettings.push(data);

                        setSettings(clonedSettings);
                        onChange(data);

                        handleCloseSettings();
                    }}/>
                </div>
            </Dialog>

        </div>

    )
}


export default Settings;