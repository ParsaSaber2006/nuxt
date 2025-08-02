<script setup>
const {getToken} = useAuthToken()

if(getToken()){
  navigateTo('/users')
}else{
  navigateTo('/login')
}
</script>