<template>
  <v-container>
    <v-row class="mb-1 pa-2 border rounded-lg mt-3" align="center">
    <v-col cols="12" md="3" class="mt-1" align-self="start">
    
        
        <date-picker
          v-model="filters.start"
          format="YYYY-MM-DD HH:mm"
          display-format="jYYYY/jMM/jDD HH:mm"
          type="datetime"
          locale="fa"
          color="#00695C"
          label="تاریخ شروع"
          @change="onDateChanged"
           
           clearable
        />
       
    </v-col>


    <v-col cols="12" md="3" class="mt-1" align-self="start">
        
        <date-picker
          v-model="filters.end"
          format="YYYY-MM-DD HH:mm"
          display-format="jYYYY/jMM/jDD HH:mm"
          type="datetime"
          locale="fa"
          color="#00695C"
          label="تاریخ پایان"
          @change="onDateChanged"
           clearable
        />
    </v-col>

      

      <v-col cols="12" md="2">
        <v-select
          v-model="filters.disposition"
          :items="items"
           item-title="name"
          label="وضعیت تماس"
          @update:model-value="loadCalls"
          variant="outlined"
          density="compact"
        />
      </v-col>
    <v-col cols="12" md="2" >
      
    <v-checkbox
              v-model="filters.user_id"
              label="فقط تماس‌های من"
              @change="loadCalls"
              variant="outlined"
              density="compact"
            />
          </v-col>
      <v-col cols="12" md="2">
        <v-checkbox
          v-model="filters.contact_call_source"
          label="فقط تماس‌های سامانه"
          @change="loadCalls"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
    <v-data-table-server
      :headers="headers"
      :header-props="customHeaderProps"
      v-model:items-per-page="itemsPerPage"
      :items-length="totalItems"
      :items="calls"
      :loading="loading"
      @update:options="loadItems"
      item-value="id"
      :expanded.sync="expanded"
      @update:expanded="onExpand"
      density="compact"
      class="elevation-6 pa-4 rounded-lg border text-start shadow-lg"
      loading-text="در حال بارگزاری تماس‌ها ..."
      items-per-page-text="تعداد آیتم هر صفحه :"
      @click:row="toggleExpand"
      :item-class="itemRowBackground"

    >

<template v-slot:item="{ item, index, isExpanded, toggleExpand }">
  <tr
    :class="index % 2 === 0 ? 'striped-even' : 'striped-odd'" @click="toggleExpandRow(item)"
    role="row"
    tabindex="0"
    
  >
    <td>{{ item.src }}</td>
    <td>{{ formatDate(item.starttime) }}</td>
    <td>{{ formatTime(item.starttime) }}</td>
    <td>{{ formatDate(item.endtime) }}</td>
    <td>{{ formatTime(item.endtime) }}</td>
    <td>{{ item.disposition }}</td>
    <td>{{ item.dst }}</td>
  </tr>
</template>


    <template v-slot:expanded-row="{ columns, item }">
  <tr>
    <td :colspan="columns.length">
      <v-card class="pa-4 elevation-20" color="blue-grey-lighten-5">
        <v-row>

          <v-col cols="12" md="12" class="mt-0" v-if="callDetails[item.id]">
          <v-card class="pa-4" color="blue-grey-lighten-5">
            <v-row>
              <v-col cols="12" md="4">
                <!-- <p><strong>شناسه:</strong> {{ callDetails[item.id].id }}</p> -->
                <p><strong>کاربر:</strong> {{ callDetails[item.id].username }}</p>
                <p class="my-2"><strong> شماره تماس مبدا :</strong> {{ callDetails[item.id].src }}</p>
                <p class="my-2"><strong> شماره تماس مقصد :</strong> {{ callDetails[item.id].dst }}</p>
              </v-col>
              <v-col cols="12" md="4">
             
                 <p><strong>تماس از سامانه:</strong> {{ callDetails[item.id].contact_call_source  == 1 ? 'بله' : 'خیر'}} </p>
                 <p class="my-2"><strong>نوع تماس:</strong> {{ callDetails[item.id].type }} </p>
                 <p class="my-2"><strong>مدت تماس:</strong> {{ callDetails[item.id].duration }} </p>
                
            
              </v-col>
              <v-col cols="12" md="4">
                <p><strong>وضعیت تماس:</strong> {{ callDetails[item.id].disposition }}</p>
                <p class="my-2"><strong>زمان شروع:</strong> {{ formatDate(callDetails[item.id].starttime) }} - {{ formatTime(callDetails[item.id].starttime) }}</p>
                <p class="my-2"><strong>زمان پایان:</strong> {{ formatDate(callDetails[item.id].endtime) }} - {{ formatTime(callDetails[item.id].endtime) }}</p>
                    <div v-if="callDetails[item.id].record !=null"> 
                <p><strong>فایل مکالمه:</strong> 
                  
                  {{ callDetails[item.id].record }} </p>
                   <v-icon icon="mdi-power" @click="downloadCall(callDetails[item.id].record)"  />
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>


          <v-col cols="12" v-else>
            <p class="text-grey">در حال بارگذاری جزئیات تماس...</p>
          </v-col>
        </v-row>
      </v-card>
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
import { onMounted, ref, watch } from 'vue';
import { useCallStore } from '@/stores/call';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
let DatePicker
DatePicker = (await import('vue3-persian-datetime-picker')).default;

const store = useCallStore();
const toast = useToast();

const {
  calls,
  filters,
  loading,
  totalItems
} = storeToRefs(store);
const customHeaderProps ={
  class:'bg-teal-lighten-3'
}
const itemsPerPage = ref(10);
const expanded = ref([]);
const startMenu = ref(false);
const endMenu = ref(false);
const callDetails = ref({});

const selectedItem = ref(null);
const items = ref([
  { id: 1, name: 'ANSWERED' ,icon :'mdi-star' },
  { id: 2, name: 'NO ANSWER', icon: 'mdi-heart' },
  { id: 3, name: 'FAILED', icon: 'mdi-thumb-up' },
  { id: 3, name: 'LOST', icon: 'mdi-thumb-up' },
]);

function toggleExpandRow(item) {
  const index = expanded.value.indexOf(item.id);
  if (index > -1) {
    expanded.value.splice(index, 1); // Remove from expanded
  } else {
    expanded.value.push(item.id); // Add to expanded
    // Optionally: Fetch details now
    if (!callDetails.value[item.id]) {
      store.getCall(item.id).then(res => {
        callDetails.value[item.id] = res;
      });
    }
  }
}

const fieldLabels = {
  id: 'شناسه',
  src: 'مبدأ',
  dst: 'مقصد',
  disposition: 'وضعیت تماس',
  starttime: 'زمان شروع',
  endtime: 'زمان پایان',
  username: 'کاربر'
};



function toggleExpand(id) {
  const index = expanded.value.indexOf(id);
  if (index > -1) {
    expanded.value.splice(index, 1); // بستن ردیف
  } else {
    expanded.value.push(id); // باز کردن ردیف
  }
}

function isRowExpanded(id) {
  return expanded.value.includes(id);
}

function test(){
  alert("dsa")
}


async function onExpand(newExpanded) {
  const newlyOpened = newExpanded.filter(id => !expanded.value.includes(id));
  const newlyClosed = expanded.value.filter(id => !newExpanded.includes(id));

  // 👇 ذخیره فقط تغییرات جدید (برای بسته شدن درست)
  expanded.value = newExpanded;

  // 👇 فقط اطلاعات جدید را دریافت کن
  for (const id of newlyOpened) {
    if (!callDetails.value[id]) {
      try {
        const res = await store.getCall(id);
        callDetails.value[id] = res;
      } catch (error) {
        callDetails.value[id] = 'خطا در دریافت جزئیات';
      }
    }
  }
}



const headers = [
  { title: 'مبدا تماس', key: 'src' },
  { title: 'تاریخ شروع', key: 'starttime' },
  { title: 'ساعت شروع', key: 'start_time' },
  { title: 'تاریخ پایان', key: 'endtime' },
  { title: 'ساعت پایان', key: 'end_time' },
  { title: 'وضعیت', key: 'disposition' },
  { title: 'مقصد', key: 'dst' },
];

async function downloadCall($data) {
    try {
        const requestData = {
            'file_record': $data
        };
        
        const res = await store.callDownload(requestData);

        // Create a Blob from the response data
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = res.headers['content-disposition'].split('filename=')[1]; // Extract filename
        document.body.appendChild(a);
        a.click(); // Trigger the download
        a.remove(); // Clean up the DOM
        window.URL.revokeObjectURL(url); // Free up memory
    } catch (err) {
        console.log(err);
    }
}

const loadCalls = async () => {
  try {
    const params = {
      per_page: itemsPerPage.value,
      page: 1,
      sort_by: null,
      sort_desc: false,
    };
    await store.loadCalls(params);
  } catch (err) {
    toast.error('خطا در بارگذاری تماس‌ها');
  }
};

const loadItems = async ({ page, itemsPerPage, sortBy, sortDesc }) => {
  const params = {
    per_page: itemsPerPage,
    page,
    sort_by: sortBy?.[0] ?? null,
    sort_desc: sortDesc?.[0] ?? false,
  };
  await store.loadCalls(params);
};

onMounted(() => {
  loadCalls();
});

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('fa-IR');
}
function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('fa-IR');
}

function itemRowBackground(item, index) {
  return index % 2 === 0 ? 'even-row' : 'odd-row'; // Alternate classes
}
function onDateChanged(value) {
  console.log('تاریخ جدید انتخاب شد:', value);
  loadCalls();
}


</script>

<style scoped>
.header-class {
  background: #666fff;
}

.custom-date-input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: inherit;
  height: 40px;
}

.striped-odd,
.striped-even {
  cursor: pointer;
}
.striped-odd{
background:#E0F2F1
}
.myStyle{
  background:red
}



</style>
