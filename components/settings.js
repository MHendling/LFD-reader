import React, {useState} from 'react'
import {Button, Classes, Dialog, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import ParameterForm from "./parameterForm";

import styles from './settings.module.css';

const Settings = (props) => {
    const {settings, currentSettings, onChange, onSubmit} = props;
    const [formOpen, setFormOpen] = useState(false);

    const handleCloseSettings = () => setFormOpen(false);

    const handleChangeSettings = (event) => {
        const currentSettings = settings.find(setting => setting.id === event.target.value);
        onChange(currentSettings);
    }

    const handleSubmitNewSettings = (newSettings) => {
        onSubmit(newSettings);
        handleCloseSettings();
    }

    return (
        <div className={styles.settings}>
            <select defaultValue=""
                    value={currentSettings?.id}
                    onChange={handleChangeSettings}>
                <option disabled defaultValue value="">Please select settings</option>
                {settings?.map((setting) => <option value={setting.id} key={setting.id}>
                    {setting.id}
                </option>)}
            </select>

            <Button outlined small intent={Intent.SUCCESS} icon="plus"
                    onClick={() => setFormOpen(true)}>
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

            <Dialog isOpen={formOpen} onClose={handleCloseSettings} className={styles.dialog}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={true}>
                <div className={classNames(Classes.DIALOG_HEADER, styles.dialogHeader)}>
                    <h3>Add new setting</h3>
                    <Button className={Classes.DIALOG_CLOSE_BUTTON} icon="cross"
                            onClick={handleCloseSettings}/></div>
                <div className={Classes.DIALOG_BODY}>
                    <ParameterForm onSubmit={handleSubmitNewSettings}/>
                </div>
            </Dialog>

        </div>

    )
}


export default Settings;