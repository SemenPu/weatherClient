import styles from './Loader.module.sass'

export const Loader = () => {
    return (
        <div className={styles.lds_spinner}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    )
}
