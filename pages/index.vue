<template>

<ul>
    <li v-for="call in calls">
        {{ call.full_name}}
    </li>
</ul> 
</template>
<script setup>
const {data:calls} = await useApiRequest('http://127.0.0.1:8000/api/users')
console.log(calls)
</script>