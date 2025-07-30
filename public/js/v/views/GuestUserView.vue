<template>
  <v-container>
    <v-row class="mb-4" align="center">
          <!-- <v-col cols="12" md="2">
        <v-checkbox
          v-model="filters.simotel_users"
          label="فقط کابران سیموتل"
          @change="loadUsers"
          variant="outlined"
          density="compact"
        />
      </v-col> -->
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.full_name"
          label="جستجو بر اساس نام"
          @input="onFilterChange"
          prepend-icon="mdi-magnify"
            variant="outlined"
          density="compact"
           color="deep-purple-lighten-1"
            bg-color="white"
        />
      </v-col>

      <v-col cols="12" md="3">
       
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
  @update:model-value="onFilterChange"
  chips
  multiple
  clearable
  variant="outlined"
  density="compact"
  :menu-props="{ maxHeight: '300px' }"
   color="deep-purple-lighten-1"
            bg-color="white"
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
        class="elevation-3 pa-4 rounded-lg border text-start"
        loading-text="در حال بارگزاری ..."

      >
      <template v-slot:item="{ item, index }">
  
  <tr :class="index % 2 === 0 ? 'striped-even' : 'striped-odd'" >
    <td>{{ item.full_name }}</td>
    <td>{{ item.job }}</td>
    <td>{{ item.city }}</td>
    <td>
      <v-btn color="cyan-darken-3" class="w-75" append-icon="mdi-phone-outgoing" size="small" >
        {{ item.extension_number }}
      </v-btn>
    </td>
    <td>{{ item.coding_code }}</td>
  </tr>
</template>


    
</v-data-table-server>
  </v-container>
</template>

<script setup>
import { computed, onMounted ,ref} from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toastification';

const toast = useToast();

const itemsPerPage =ref(10)
const store = useUserStore();

const onFilterChange = () => {
  options.value.page = 1; // وقتی فیلتر عوض شد، برگرد صفحه 1
  loadItems(options.value);
};

const router = useRouter();

const {
  users,
  filters,
  loading,
  filteredUsers,
  allCities,
  allJobs,
} = storeToRefs(store);

const headers = [
  { title: 'نام', key: 'full_name' },
  { title: 'شغل', key: 'job' },
  { title: 'شهر', key: 'city' },
  { title: 'داخلی', key: 'extension_number' },
  { title: 'کدینگ', key: 'coding_code' },
];


onMounted(async () => {
  await store.initFilterOptions();
    options.value.itemsPerPage = 10;
    loadUsers();
});

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  filters: {},
});

const totalItems = ref(0); // از سمت سرور دریافت می‌شه
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
    const response = await store.loadGuestUsers(params);
    
   
    users.value = response.data.data;
    totalItems.value = response.data.meta.total || 0;
  } catch (error) {
    
    
    toast.error('خطا در بارگذاری کاربران');
  } finally {
    loading.value = false;
  }
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
  store.loadGuestUsers(params).then((response) => {
  totalItems.value = response.data.meta.total; 
  });
   }catch(err){
    
    // console.log(err,"userview")
   }
};

const jobOptions = computed(() => allJobs.value);
const cityOptions = computed(() => allCities.value);

function rowClass(_, index) {
  return index % 2 === 0 ? 'bg-grey-lighten-4' : '';
}
</script>

<style scoped>
.striped-even {
  background-color:#c5dfd8;
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