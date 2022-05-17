function formatMessage(username, text){
    return {
        username,
        text,
        createAt: new Date().toLocaleString()
    }
}