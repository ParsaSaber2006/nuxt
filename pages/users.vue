<template>
  <v-container>

    <v-row class="mb-1 pa-4 border rounded-lg mt-3" align="center" >
       <v-col cols="12" md="2">
        <v-checkbox
          v-model="filters.simotel_users"
          label="فقط کابران سیموتل"
          @change="onFilterChange"
          variant="outlined"
          density="compact"
           color="red"
    bg-color="white"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.full_name"
          label="جستجو بر اساس نام"
          @input="onFilterChange"
          variant="outlined"
          density="compact"
           color="deep-purple-lighten-1"
            bg-color="white"
        />
      </v-col>


      <v-col cols="12" md="2">
        <v-text-field
          v-model="filters.job"
          :items="jobOptions"
          label="فیلتر بر اساس شغل"
         @input="onFilterChange"
          variant="outlined"
          density="compact"
           color="deep-purple-lighten-1"
    bg-color="white"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-autocomplete
            v-model="filters.city"
            :items="cityOptions"
            label="فیلتر بر اساس شهر"
            @update:model-value="loadUsers"
            chips
            multiple
            clearable
            variant="outlined"
            density="compact"
            :menu-props="{ maxHeight: '300px' }"
          />

      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
          v-model="filters.coding_code"
          label="کدینگ"
          @input="onFilterChange"
           variant="outlined"
          density="compact"
           color="deep-purple-lighten-1"
            bg-color="white"
        />
      </v-col>

    </v-row>
      <v-btn
  v-if="isAdmin"
  color="cyan-darken-3"
  append-icon='mdi-account-multiple-plus-outline'
  class="mt-5 mb-5"
  @click="goToCreateUser"
>
  ایجاد کاربر
</v-btn>
<v-row>
<v-data-table-server
        :headers="headers"
        :header-props="{class:'bg-teal-lighten-3'}"
        v-model:items-per-page="itemsPerPage"
        :items-length="totalItems"
        :items="users"
        :loading="loading"
        @update:options="loadItems"
        density="compact"
        item-value="id"
        class="elevation-6 pa-4 rounded-lg border text-start shadow-lg"
        loading-text="در حال بارگزاری ..."
        @click:row="goToEdit"
         :item-class="getRowClass"
         items-per-page-text="تعداد آیتم هر صفحه :"

      >


 <template v-slot:item="{ item, index }">

  <tr :class="index % 2 === 0 ? 'striped-even' : 'striped-odd'" @click="goToEdit($event, { item })">
    <td>{{ item.full_name }}</td>
    <td>{{ item.job }}</td>
    <td>{{ item.city }}</td>
    <td>
      <v-btn color="cyan-darken-3" class="w-75" append-icon="mdi-phone-outgoing" size="small" @click.stop="handleExtensionClick(item)">
        {{ item.extension_number }}
      </v-btn>
    </td>
    <td>{{ item.coding_code }}</td>
    <td>
      <v-btn color="cyan-darken-4" size="small" @click.stop="handleCallClick(item)">
        تماس
      </v-btn>
    </td>
    <td v-if="isAdmin">
      <v-icon icon="mdi-account-remove" class="me-2" @click.stop="deleteUser(item.id)" />
    </td>
  </tr>
</template>

</v-data-table-server>
</v-row>

  </v-container>

</template>

<script setup>
const {getToken} = useAuthToken()
if(!getToken()){
  navigateTo('/login')
}
import { computed, onMounted ,ref} from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import {generateCall} from '@/api/simotel';
import { useToast } from 'vue-toastification';

const toast = useToast();

const itemsPerPage =ref(10)
const store = useUserStore();
const storeAuth = useAuthStore();

const isAdmin = computed(() => storeAuth.isAdmin);
const router = useRouter();

const {
  users,
  filters,
  loading,
  filteredUsers,
  allCities,
  allJobs,
} = storeToRefs(store);



 async function loadItems({ page, itemsPerPage, sortBy, sortDesc }) {
  loading.value = true;

  const params = {
    per_page: itemsPerPage,
    page: page,
    sort_by: sortBy?.[0]?.key?? null,
    sort_desc:sortBy?.[0]?.order === 'desc',
    filter: {
      job: filters.value.job,
      city: filters.value.city,
      full_name: filters.value.full_name,
      coding_code: filters.value.coding_code,
      simotel_users: filters.value.simotel_users,
    },
  };


  try {
    const response = await store.loadUsers(params);

    if(response.error == 401 || response.error ==403){
      toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
       storeAuth.logout();
      router.push("/login");
    }
    users.value = response.data.data;
    totalItems.value = response.data.meta.total || 0;
  } catch (error) {


    toast.error('خطا در بارگذاری کاربران');
  } finally {
    loading.value = false;
  }
}


const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  filters: {},
});

const totalItems = ref(0); // از سمت سرور دریافت می‌شه

const onOptionsUpdate = (newOptions) => {
  options.value.page = newOptions.page
  options.value.itemsPerPage = newOptions.itemsPerPage
  options.value.sortBy = newOptions.sortBy
  options.value.sortDesc = newOptions.sortDesc
  loadUsers();
};

const onFilterChange = () => {
  options.value.page = 1; // وقتی فیلتر عوض شد، برگرد صفحه 1
  loadItems(options.value);
};


const headers = [
  { title: 'نام', key: 'full_name' ,class: 'header-class'},
  { title: 'شغل', key: 'job' ,class: 'header-class'},
  { title: 'شهر', key: 'city' ,class: 'header-class'},
  { title: 'داخلی', key: 'extension_number' ,class: 'header-class'},
  { title: 'کدینگ', key: 'coding_code' ,class: 'header-class'},
  { title: 'تماس', value: 'call', sortable: false ,class: 'header-class'},
  // { title: 'حذف', value: 'delete', sortable: false },
];
if(isAdmin.value){
  headers.push(
    { title: 'حذف', value: 'delete', sortable: false }
  )
}

onMounted(async () => {
  await store.initFilterOptions();
  options.value.itemsPerPage = 10;
  loadUsers();
  console.log(users);
});
function goToCreateUser() {
  router.push({ name: 'UserCreate'});
}

const loadUsers = () => {
  try{


  const params = {
    per_page: options.value.itemsPerPage,
    page: options.value.page,
    sort_by: sortBy?.[0]?.key?? null,
    sort_desc:sortBy?.[0]?.order === 'desc',
    filter : {
          'job':filters.value.job,
          'city':filters.value.city,
          'full_name':filters.value.full_name,
          'coding_code':filters.value.coding_code,
          'simotel_users':filters.value.simotel_users,
        },
  };
console.log(params,"das",options.value)
  store.loadUsers(params).then((response) => {
  totalItems.value = response.data.meta.total;
  });
   }catch(err){

    // console.log(err,"userview")
   }
};


const jobOptions = computed(() => allJobs.value);
const cityOptions = computed(() => allCities.value);



async function deleteUser(user){
   const confirmed = window.confirm('آیا از حذف این کاربر مطمئن هستید؟');
  if (!confirmed) return;
  try{

    if(storeAuth.user.id == user){
      toast.error("شما نمی توانید مدیر را حذف کنید")
      return;
    }

    const res = store.userDelete(user);
           if(res.error == 401 || res.error ==403){

      toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
       storeAuth.logout();
      router.push("/login");

      }else{
    await store.loadUsers();
    toast.success("با موفقیت حذف شد")
      }

  }catch(err){
      if(err.error == 401 || err.error ==403){
      toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
       storeAuth.logout();
      router.push("/login");
    }
    toast.error(err)
  }
}

function goToEdit(event,user) {
  if(isAdmin.value)
  router.push({ name: 'UserForm', params: { id: user.item.id } });
}
function getRowClass(item, index) {
  return index % 2 === 0 ? 'striped-even' : 'striped-odd';
}


function handleExtensionClick(user){

  const params = {dst:user.extension_number};
  this.callUser(params);
}

function handleCallClick(user){

  const params = {dst:user.mobile_number};
  this.callUser(params);
}


async function callUser(params) {
  try{

  const res = await generateCall(params);
  console.log(res.data.success)
  if(res.data.success == 0)
  toast.error(res.data.message)
  else
  toast.success(res.data.data.originated_call_id)
  }catch(err){
    if(err.status ==401 || err.status == 403){
  toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
       storeAuth.logout();
      router.push("/login");
    }
    toast.error("متاسفانه استثنایی رخ داد ",err)
  }
}
function rowClass(_, index) {
  return index % 2 === 0 ? 'bg-grey-lighten-4' : '';
}
</script>

<style scoped>
.striped-even {
  background-color:#E0F2F1;
  cursor: pointer;
}
.striped-odd {
  background-color: #ffffff;
  cursor: pointer;
}

.header-class {
  background: #666fff;
}

</style>
