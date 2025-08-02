import { useAuthToken } from "./useAuthToken"

export const useAuthRequest = (
    url:string,
    method:'GET'|'POST'|'PUT'|'DELETE'='GET',
    params:Record<string,any> | null = null
)=>
{
    const {getToken} = useAuthToken()
    $fetch(url,{
        method:method,
        body:params,
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    })
}