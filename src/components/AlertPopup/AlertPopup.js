import React from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './AlertPopup.module.sass'

export const AlertPopup = ({ show = false, desc }) => {
    return (
        <CSSTransition
            in={show}
            timeout={3000}
            classNames='aler-popup'
        >
            <div className={styles.alert__window}>
                {desc}
            </div>
        </CSSTransition>
    )
}
