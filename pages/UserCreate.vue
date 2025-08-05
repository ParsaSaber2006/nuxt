<template>
  <v-container class="pa-0">
    <v-card class="pa-0 mt-5" >
      <v-card-title class="text-h5">فرم ثبت‌ اطلاعات کاربر</v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="deep-purple-lighten-1"
        class="ma-5 ml-auto mr-auto"
      ></v-progress-circular>
      <!-- اطلاعات شخصی -->
      <v-card-subtitle class="mb-4 ">اطلاعات شخصی</v-card-subtitle>
      <v-row class="border rounded-md pa-1  w-75 ml-auto mr-auto" justify="space-between" dense>
        <v-col cols="10" md="5" class="pa-2"  v-for="field in personalFields" :key="field" >

            <template v-if="field === 'province'">
              
            <v-select
              v-model="form[field]"
              :items="provinces"
              item-value="name"
              item-title="name"
              label="استان"
              variant="outlined"
              density="compact"
              clearable
              color="deep-purple-lighten-1"
              bg-color="white"
              @update:modelValue="onProvinceChange"
            />
            
          </template>
          
         <template v-else-if="field === 'city'">
  <v-select
    v-model="form[field]"
    :items="cities"
    label="شهر"
    item-value="name"
     item-title="name"
    clearable
    variant="outlined"
    density="compact"
     color="deep-purple-lighten-1"
              bg-color="white"
  />
</template> 
<template v-else-if="field === 'is_public'">
  <v-checkbox
    v-model="form.is_public"
    :label="labels.is_public"
     :true-value="1" 
     :false-value="0"
    color="deep-orange-darken-4"
  ></v-checkbox>

</template>
<template v-else-if="field === 'id_simotel'">
</template>

<template v-else-if="field ==='is_simotel_user'">
   <v-checkbox 
   @click="showContent = !showContent"
   v-model="form.is_simotel_user"
  :true-value="1" 
  :false-value="0" 
  color="red-darken-4"
  :label="labels[field]">
</v-checkbox>
</template>
<template v-else-if="field === 'mobile_number'">
 <v-text-field
    v-model="form[field]"
    :label="labels[field]"
    type="number"
    outlined
    dense
    variant="outlined"
    density="compact"
    color="deep-purple-lighten-1"
    bg-color="white"
  ></v-text-field>

</template>
<template v-else>
  <v-text-field
    v-model="form[field]"
    :label="labels[field]"
    :type="field === 'password' ? 'password' : 'text'"
    outlined
    dense
    variant="outlined"
    density="compact"
    color="deep-purple-lighten-1"
    bg-color="white"
  ></v-text-field>
</template>

        </v-col>
      </v-row>
    <!-- //================ voip  -->
        
      <template v-if="showContent" >
      
      <v-divider class="my-4"></v-divider>
 
      <v-card-subtitle  class="mb-2">تنظیمات VoIP</v-card-subtitle>
      <v-row class="border rounded-md pa-1  w-75 ml-auto mr-auto" justify="space-between" dense v-if="showContent">
        <v-col cols="10" md="5" class="pa-2" v-for="field in voipFields" :key="field">
            <template v-if="field === 'extension_number'">
              
            <v-text-field
            v-model="form[field]"
            :label="labels[field]"
            type="number"
            outlined
            dense
             variant="outlined"
              density="compact"
              color="deep-purple-lighten-1"
              bg-color="white"
          ></v-text-field>
            
          </template>
           <template v-else-if="field === 'cid_number'">
              
            <v-text-field
            v-model="form[field]"
            :label="labels[field]"
            type="number"
            outlined
            dense
             variant="outlined"
              density="compact"
              color="deep-purple-lighten-1"
              bg-color="white"
          ></v-text-field>
            
          </template>
          <template v-else-if="['nat', 'type', 'active'].includes(field)">
  <v-select
    v-model="form[field]"
    :items="voipSelectOptions[field]"
    item-title="title"
    item-value="value"
    :label="labels[field]"
    variant="outlined"
    density="compact"
    clearable
    color="deep-purple-lighten-1"
    bg-color="white"
  />
</template>
          <template  v-else>
       <v-text-field
    v-model="form[field]"
    :label="labels[field]"
    :type="field === 'password' ? (showPassword ? 'text' : 'password') : 'text'"
    outlined
    dense
    variant="outlined"
    density="compact"
    color="deep-purple-lighten-1"
    bg-color="white"
    :append-inner-icon="field === 'password' ? (showPassword ? 'mdi-eye' : 'mdi-eye-off') : ''"
    @click:append-inner="field === 'password' && (showPassword = !showPassword)"
  ></v-text-field>
          </template>
        </v-col>
      </v-row>
</template>
      <!-- Forward Policy -->
       <template v-if="showContent" >
      <v-divider class="my-4"></v-divider>
      
      <v-card-subtitle class="mb-2">قوانین انتقال تماس (Forward Policy)</v-card-subtitle>
      <v-row   class="border rounded-md pa-1  w-75 ml-auto mr-auto" justify="space-between" dense>
        <v-col cols="10" md="5" v-for="(v, k) in form.forward_policy" :key="k">
          <v-text-field
            v-model="form.forward_policy[k]"
            :label="`${k}`"
            outlined
            dense
             variant="outlined"
              density="compact"
              color="deep-purple-lighten-1"
              bg-color="white"
          ></v-text-field>
        </v-col>
      </v-row>
      </template>

      <!-- دکمه ثبت -->
    

    <v-btn
  :loading="submitLoading"
  :disabled="submitLoading"
  color="secondary"
  prepend-icon="mdi-check-underline-circle"
  elevation="24"
  class="mt-4 mb-2 ml-auto mr-auto"
  @click="submitForm"
>
  ثبت
</v-btn>


      
    </v-card>
  </v-container>

 
</template>

<script setup>

import { reactive, onMounted,computed,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const toast = useToast();
const provinces = ref([]);
const cities = ref([]);
const showContent= ref(false)
const oldStateIsSimotel =ref(false)
const showPassword = ref(false);

const isPublicNumeric = computed(() => (showContent ? 1 : 0));
const submitLoading = ref(false);
const voipSelectOptions = {
  nat: [
    { title: 'yes', value: 'yes' },
    { title: 'no', value: 'no' },
    { title: 'Force Report & Co-Media', value: 'force-report-co-media' },
  ],
  type: [
    { title: 'Friend', value: 'friend' },
    { title: 'User', value: 'user' },
    { title: 'Peer', value: 'peer' },
  ],
  active: [
    { title: 'yes', value: 'yes' },
    { title: 'no', value: 'no' },
  ],
};

const storeAuth = useAuthStore();

const isAdmin = computed(() => storeAuth.isAdmin);

const store = useUserStore();
const loading = ref(true); 


const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const personalFields = [
  'full_name',

  'job',
  'province',
  'city',
  'coding_code',
  'mobile_number',
  'duties',
  'id_simotel',
  'is_simotel_user'
  
  
];
if (isAdmin.value) {
    personalFields.push('is_public');
  }
const voipFields = [
  
  'user_type',
  'active',
  'username',
  'password',
  'extension_number',
  'cid_number',
  'call_record',
  'push_notification',
  'deny',
  'permit',
  'dtmfmode',
  'canreinvite',
  'directmedia',
  'context',
  'host',
  'type',
  'nat',
  'port',
  'qualify',
  'callgroup',
  'pickupgroup',
  'callcounter',
  'faxdetect',
  'call_limit',
  'trunk',
  'transfer',
  'email',
  'more_options',
];

const labels = {
  full_name: 'نام کامل',
  extension_number: 'شماره داخلی',
  job: 'شغل',
  city: 'شهر',
  coding_code: 'کد سازمانی',
  mobile_number: 'شماره موبایل',
  duties: 'وظایف',
  password: 'رمز عبور',
  is_public: 'دسترسی برای همه',
  province:"استان",
  is_simotel_user:"ایجاد مخاطب در سیموتل",

  username: '  نام کاربری سیموتل',
  user_type: 'نوع کاربر',
  active: 'فعال',
  cid_number: 'شماره نمایش تماس',
  call_record: 'ضبط تماس',
  push_notification: 'نوتیفیکیشن',
  deny: 'دسترسی ممنوع',
  permit: 'دسترسی مجاز',
  dtmfmode: 'DTMF Mode',
  canreinvite: 'Can Reinvite',
  directmedia: 'مدیای مستقیم',
  context: 'کانتکست',
  host: 'Host',
  type: 'نوع',
  nat: 'NAT',
  port: 'پورت',
  qualify: 'Qualify',
  callgroup: 'گروه تماس',
  pickupgroup: 'گروه پاسخ',
  callcounter: 'شمارنده تماس',
  faxdetect: 'تشخیص فکس',
  call_limit: 'محدودیت تماس',
  trunk: 'ترانک',
  transfer: 'انتقال تماس',
  email: 'ایمیل',
  more_options: 'تنظیمات بیشتر',
};

const form = reactive({
  // شخصی
  full_name: '',
  extension_number: '',
  job: '',
  city: '',
  coding_code: '',
  mobile_number: '',
  duties: '',
  password: '',
  is_public: false,
  province:'',

  // ویپ
  username: '',
  user_type: 'SIP',
  active: 'yes',
  cid_number: '',
  call_record: 'no',
  push_notification: 'no',
  deny: '0.0.0.0/0.0.0.0',
  permit: '0.0.0.0/0.0.0.0',
  dtmfmode: 'rfc2833',
  canreinvite: 'no',
  directmedia: 'no',
  context: 'main_routing',
  host: 'dynamic',
  type: 'user',
  nat: 'no',
  port: '5060',
  qualify: 'no',
  callgroup: '1',
  pickupgroup: '1',
  callcounter: 'no',
  faxdetect: 'no',
  call_limit: '2',
  trunk: 'no',
  transfer: 'no',
  email: '',
  more_options: '',

  forward_policy: {
    Busy: '',
    'No Answer': '',
    UnAvailable: '',
    All: '',
  },
});
function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}



onMounted(async () => {
  if (userId && userId !== 'new') {
    try {
      const data = await store.getUser(userId);
       
      if(data.error == 401 || data.error ==403){
          
      toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
      storeAuth.logout();
      router.push("/login");
    
      }
      // شخصی
      personalFields.forEach(field => {

        
        if(field == 'is_simotel_user' && data[field]){

          showContent.value = data[field]
          oldStateIsSimotel.value = data[field]
          
        }
      

        form[field] = data[field] ?? '';
      });

      // VoIP
      const simotelData = isObject(data.simotelData) ? data.simotelData : {};
         
         voipFields.forEach(field => {
  form[field] = data[field] 
    ?? simotelData[field] 
    ?? getDefaultVoipValue(field);
});


      // Forward Policy
      form.forward_policy = {
        Busy: data.forward_policy?.Busy ?? '',
        'No Answer': data.forward_policy?.['No Answer'] ?? '',
        UnAvailable: data.forward_policy?.UnAvailable ?? '',
        All: data.forward_policy?.All ?? '',
      };
 if (form.province) {
  await onProvinceChange(form.province, false); // مقدار form.city را پاک نکن
}

    } catch (err) {
      toast.error("خطا در دریافت اطلاعات کاربر",err);
      
    }
  }
   loading.value = false;
   try {
  const response = await store.getProvinces(); 
  provinces.value = response;
} catch (err) {
  console.error('خطا در دریافت لیست استان‌ها:', err);
}

});
const onProvinceChange = async (provinceId, resetCity = true) => {
  if (resetCity) {
    form.city = ''; // فقط اگر resetCity=true بود ریستش کن
  }

  if (!provinceId) {
    cities.value = [];
    return;
  }

  try {
    const modifiedProvinceId = provinceId.replace(/\s+/g, '-');
    const response = await store.getCitiesByProvince(modifiedProvinceId);
    cities.value = response;

    // بررسی کن که city در لیست جدید وجود دارد یا نه
    if (!cities.value.find(c => c.name === form.city)) {
      form.city = ''; // اگر وجود نداشت، پاکش کن
    }

  } catch (err) {
    cities.value = [];
  }
};


function getDefaultVoipValue(field) {
  const defaults = {
    user_type: 'SIP',
    active: 'yes',
    call_record: 'no',
    push_notification: 'no',
    deny: '0.0.0.0/0.0.0.0',
    permit: '0.0.0.0/0.0.0.0',
    dtmfmode: 'rfc2833',
    canreinvite: 'no',
    directmedia: 'no',
    context: 'main_routing',
    host: 'dynamic',
    type: 'user',
    nat: 'no',
    port: '5060',
    qualify: 'no',
    callgroup: '1',
    pickupgroup: '1',
    callcounter: 'no',
    faxdetect: 'no',
    call_limit: '2',
    trunk: 'no',
    transfer: 'no',
    email: '',
    more_options: '',
  };
  return defaults[field] ?? '';
}


const submitForm = async () => {
  try {
    submitLoading.value = true;

    if (userId && userId !== 'new') {
        
      if(oldStateIsSimotel.value == true && form.is_simotel_user ==false){
         const confirmed = window.confirm('با اعمال این تغییرات مخاطب از سیموتل حذف خواهد شد، آیا مطمعنید ؟');
          if (!confirmed){
          submitLoading.value = false;

            return;
          }
      }
      const a = await store.userUpdate(userId, form);
      if (a.error === 400) {
      if (Array.isArray(a.data)) {
        toast.error(a.data.join('\n'), { style: { whiteSpace: 'pre-line' } });
      } else if (typeof a.data === 'string') {
        toast.error(a.data);
      } else {
        toast.error('خطای ناشناخته‌ای رخ داده است');
      }
      submitLoading.value = false;

      return;
    }
       if(a.error == 401 || a.error ==403){
          submitLoading.value = false;

      toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
       storeAuth.logout();
      router.push("/login");
      return;
        
      }
      if(a.error == 422 ){
         const messages = Object.values(a.data).flat();
      toast.error(messages.join('\n'), {
  style: { whiteSpace: 'pre-line' }
})
submitLoading.value = false;

      }else{
        submitLoading.value = false;

      toast.success('کاربر با موفقیت ویرایش شد');
      router.push('/users');
      }
    } else {
      
      const a = await store.userCreate(form);
           if(a.error == 401 || a.error ==403){
            submitLoading.value = false;

          toast.error("متاسفانه توکن ورود شما منقضی شده است ، مجدد ورود کنید")
          storeAuth.logout();
          router.push("/login");
    
      }   if(a.error == 422 ){
        submitLoading.value = false;

         const messages = Object.values(a.data).flat();
          toast.error(messages.join('\n'), {
      style: { whiteSpace: 'pre-line' }
    })
      }else{
        submitLoading.value = false;

      toast.success("کاربر با موفقیت ایجاد شد")
router.push('/users');
      }
    }
    
  } catch (err) {
    // toast.error('خطا در ثبت یا ویرایش کاربر');
 const response = err?.response;

if (response?.status === 422) {
  const messages = Object.values(response.data).flat();
  toast.error(messages.join('\n'), {
    style: { whiteSpace: 'pre-line' }
  });
} else if (response?.status === 403) {
  toast.error('دسترسی غیرمجاز');
} else {
  toast.error(response?.data || 'خطایی در ثبت اطلاعات رخ داد');
}
submitLoading.value = false;

  }
};
</script>

<style scoped>
.form-col {
  padding-inline: 12px; /* فاصله از کناره‌ها */
}

.form-col .v-input {
  width: 100%;
  max-width: 350px; /* عرض ثابت مناسب */
}
.form-field {
  display: flex;
  justify-content: space-between; /* برای چسباندن آیتم به راست */
  padding-inline: 4px;       /* فاصله‌ی کم بین آیتم‌ها */
}

.form-field .v-input,
.form-field .v-select {
  width: 60%;
  max-width: 80%; /* تا حد امکان از فضای ستون استفاده کند */
  text-align: right;
  direction: rtl;
}

</style>
