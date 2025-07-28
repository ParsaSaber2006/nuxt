export const useApiRequest = (url: string,
    method:'GET'|'POST'|'PUT'|'DELETE'='GET',
    params:Record<string,any> | null=null
) => {

    const { getToken } = useAuth();
    if(!getToken()){
        alert("Please First Login")
        return navigateTo('/')
    }
        return $fetch(url, {
            method:method,
            body: params,
             headers: {
                Authorization: `bearer ${getToken()}`
            }
        })
    }
