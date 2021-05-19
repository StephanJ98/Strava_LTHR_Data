import React from 'react'
import styles from './header.module.css'

export default function header() {
    return (
        <div className={styles.header}>
            <p className={styles.headerText}>Strava</p>
            <p className={styles.headerText}>LTHR Data</p>
        </div>
    )
}
