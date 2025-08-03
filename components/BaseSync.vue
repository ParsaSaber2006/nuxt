<template>
  <v-dialog v-model="dialog" max-width="600px"> <!-- افزایش عرض دیالوگ -->
    <v-sheet class="d-flex flex-1 flex-column pa-4"> <!-- افزودن padding -->
      <v-alert type="warning" class="mb-4"> <!-- متن هشدار -->
        با زدن دکمه  ، تمامی کاربران سیموتل در سامانه اضافه می شوند
      </v-alert>
     <div v-if="fetchedCount > 0 && step === 'sync'" class="mt-2">
  <p>تعداد رکوردهای دریافت‌شده: <strong>{{ fetchedCount }}</strong></p>
</div>

<div class="d-flex justify-center mt-4">
  <v-btn
    size="small"
    @click="step === 'fetch' ? fetchAndSaveCsv() : startSync()"
    class="px-5 text-center"
    color="blue-lighten-4"
    rounded
    prepend-icon="mdi-cloud-sync"
  >
    {{ step === 'fetch' ? 'دریافت و ذخیره‌سازی' : 'شروع همگام‌سازی' }}
  </v-btn>
</div>


      <div  class="mt-4"> <!-- فاصله برای بارگذاری -->
         <p v-if='loading'>در حال پردازش...</p>
          <v-progress-linear
          v-if='loading'
      color="yellow-darken-2"
      indeterminate
    ></v-progress-linear>
        <!-- نمایش نتایج -->
<v-divider class="my-4"></v-divider>

<div >
  <v-alert type="info" class="mb-3" border="start" variant="tonal">
    <strong>نتیجه همگام‌سازی:</strong>
    <ul class="mt-2">
      <li>تعداد کاربران ذخیره‌شده: <strong>{{ successCount }}</strong></li>
      <li>تعداد خطاها: <strong>{{ failedItems.length }}</strong></li>
    </ul>
  </v-alert>

  <!-- <v-expand-transition> -->
    
    <v-card v-if="failedItems.length > 0" class="pa-4" color="red-lighten-5">
      <strong>لیست خطاها:</strong>
      <v-table dense>
        <thead>
          <tr>
            <th>نام</th>
            <th>شماره داخلی</th>
            <th>پیام خطا</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in failedItems" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.extension_number }}</td>
            <td>{{ item.error }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  <!-- </v-expand-transition> -->
</div>

      </div>
      <div v-if="error" style="color: red">{{ error }}</div>
    </v-sheet>
  </v-dialog>
</template>


<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const toast = useToast();
const storeAuth = useAuthStore();

const successCount = ref(0)
const failedItems = ref([])
const loading = ref(false)
const error = ref(null)
const progress = ref(0)
const fetchedCount = ref(0)
const step = ref('fetch') // fetch → sync

const props = defineProps({
  value: Boolean,
  title: String,
});

const emit = defineEmits(['update:value']);
const dialog = ref(props.value);

watch(() => props.value, (newVal) => {
  dialog.value = newVal;
});
watch(dialog, (newVal) => {
  emit('update:value', newVal);
});

function translateErrorMessage(message) {
  if (message.includes('Duplicate')) return 'اطلاعات تکراری است.'
  if (message.includes('required')) return 'برخی از فیلدها الزامی هستند.'
  if (message.includes('permission')) return 'عدم دسترسی.'
  return 'خطا در پردازش داده.'
}

const fetchAndSaveCsv = async () => {
  loading.value = true
  error.value = null
  progress.value = 0

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/simotel/users/sync', {
      headers: {
        Authorization: `Bearer ${storeAuth.token}`,
      }
    })

    // فرض بر اینه که خروجی شامل record_count باشه
    fetchedCount.value = response.data.count_record || 0

    toast.success(`دریافت و ذخیره CSV با موفقیت انجام شد (${fetchedCount.value} رکورد)`)
    step.value = 'sync'

  } catch (err) {
    toast.error('خطا در دریافت یا ذخیره CSV: ' + err.message)
    console.error(err)
  } finally {
    loading.value = false
  }
}

const startSync = async () => {
  loading.value = true
  error.value = null
  progress.value = 0

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/simotel/bulk/sync', null, {
      headers: {
        Authorization: `Bearer ${storeAuth.token}`,
      }
    })

    const { success_count, failed_items } = response.data

    successCount.value = success_count
    failedItems.value = failed_items.map(item => ({
      ...item,
      error: translateErrorMessage(item.error),
    }))

    if (failedItems.value.length > 0) {
      toast.error(`${failedItems.value.length} مورد ناموفق!`)
    } else {
      toast.success('همگام‌سازی با موفقیت انجام شد')
    }

  } catch (err) {
    toast.error('خطا در همگام‌سازی: ' + err.message)
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
