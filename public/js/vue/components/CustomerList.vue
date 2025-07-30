<template>
  <v-container>
    <v-row class="mb-1 pa-4 border rounded-lg "  align="start">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.full_name"
          label="جستجو بر اساس نام"
          @input="debouncedLoad"
          prepend-icon="mdi-magnify"
           variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.job"
          :items="jobOptions"
          label="شغل"
          multiple
          chips
          clearable
          @update:model-value="store.loadCustomers"
           variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.city"
          :items="cityOptions"
          label="شهر"
          multiple
          chips
          clearable
          @update:model-value="store.loadCustomers"
           variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="customers"
      :loading="loading"
      @click:row="onRowClick"
      loading-text="در حال بارگزاری  ..."
       @update:options="onOptionsUpdate"
       :options="options"
    >
      <template #item.call="{ item }">
        <v-btn color="primary" @click.stop="callCustomer(item)">تماس</v-btn>
      </template>

        <template #item.delete="{ item }">

       <v-icon icon="mdi-delete-circle-outline" class="me-2" @click.stop="deleteCustomer(item.id)" />
  </template>
    </v-data-table-server>

  
  </v-container>
</template>

<script setup>
import { onMounted, computed,ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerStore } from '@/stores/customer';
import { defineEmits } from 'vue';
import debounce from 'lodash/debounce';
import {generateCall} from '@/api/simotel';
import { useToast } from 'vue-toastification';

const toast = useToast();


const emit = defineEmits(['edit']);
const store = useCustomerStore();

const {
  customers,
  pagination,
  filteredCustomers,
  filters,
  sort,
  loading,
} = storeToRefs(store);

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  filters: {},
});

const totalItems = ref(0); 
const cityOptions = computed(() => store.allCities);
const jobOptions = computed(() => store.allJobs);

const headers = [
  { title: 'نام', key: 'full_name' },
  { title: 'شغل', key: 'job' },
  { title: 'شهر', key: 'city' },
  { title: 'تماس', key: 'call', sortable: false },
  { title: 'حذف', key: 'delete', sortable: false },
];

const onOptionsUpdate = (newOptions) => {
  options.value = newOptions;
  loadCustomers();
};
onMounted(async () => {
  await store.initFilterOptions();
  loadCustomers();
});



const onFilterChange = () => {
  options.value.page = 1; // وقتی فیلتر عوض شد، برگرد صفحه 1
  loadCustomers();
};

const loadCustomers = () => {
  const params = {
    page: options.value.page,
    per_page: options.value.itemsPerPage,
    sort_by: options.value.sortBy?.[0] ?? null,
    sort_desc: options.value.sortDesc?.[0] ?? false,
    filter: filters.value,
  };
console.log(params)
  store.loadCustomers(params).then((response) => {
    totalItems.value = response.meta.total; // یا هر چیزی که سرورت برمی‌گردونه
  });
};

const debouncedLoad = debounce(store.loadCustomers, 300);

async function callCustomer(customer) {

  try{
  const params = {dst:customer.mobile_number};
  const res = await generateCall(params);
  console.log(res.data.success)
  if(res.data.success == 0)
  toast.error(res.data.message)

  else
  toast.success(res.data.data.originated_call_id)
  }catch(err){
    
    toast.error("sorry")
  }
  
}

async function deleteCustomer(id){
    const confirmed = window.confirm('آیا از حذف این کاربر مطمئن هستید؟');
    if (!confirmed) return;
    try{
    await store.customerDelete(id);
    
    store.loadCustomers(); 
    toast.success('با موفقیت حذف شد')
     

  }catch (err){
    const response = err;
    if (response && response.status === 422 ) {
      const messages = Object.values(response.response.data).flat();
      toast.error(messages.join('، '));
    } else if (response && response.status === 403) {
      toast.error('دسترسی غیرمجاز');
    }else if (response && response.status === 401) {
      toast.error('دسترسی غیرمجاز');
    } else {
      console.log(err);
      toast.error('خطایی در ثبت اطلاعات رخ داد');
    }
  }
}
function onRowClick(event, customer) {
  emit('edit', customer.item);
}
</script>
