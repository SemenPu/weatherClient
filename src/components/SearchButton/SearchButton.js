import styles from './SearchButton.module.sass'


export const SearchButton = ({ sendRequest }) => {
    return (
        <button
            id={styles.search_button}
            onClick={sendRequest}
        >
            Найти
        </button>
    )
}


