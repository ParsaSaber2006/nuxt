<script setup>
const {getToken} = useAuth();

if(!getToken()){
    navigateTo('/login')
}
</script>