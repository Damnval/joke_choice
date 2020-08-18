export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) {
            localStorage.setItem('state', JSON.stringify({'user': {}}))
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (error) {
        return undefined
    }
}

export const saveState = (state) => {
    try {
        let serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (error) {
        console.log(error)
    }
}
