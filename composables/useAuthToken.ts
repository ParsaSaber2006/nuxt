export const useAuthToken = () => 
    {
    const token = useCookie('token',{
        maxAge:3600*24
    })

    const setToken = (jwt:string) =>
    {
        token.value = jwt
    }
    
    const getToken = ()=>
    {
        if(!getToken){
            navigateTo('login')
        }
        return token.value
    }

    const removeToken = ()=>
    {
        token.value = null
    }
    return {setToken,getToken,removeToken}
}