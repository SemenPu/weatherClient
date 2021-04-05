import styles from './SearchInput.module.sass'

export const SearchInput = ({ val, inputId, onType }) => {
    return (
        <input
            className={styles.search_input}
            id={inputId}
            type='text'
            autoComplete='off'
            autoFocus
            value={val}
            onChange={onType}
        />
    )
}
