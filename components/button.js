import React from 'react';
import classNames from "classnames";

import styles from './button.module.css'

const Button = ({onClick, children, className, disabled}) => (
    <button disabled={disabled} className={classNames(styles.button, className)} onClick={onClick}>{children}</button>
);

export default Button;