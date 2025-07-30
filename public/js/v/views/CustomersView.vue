<template>
  <v-container>


    <v-row>
      <v-col>
        <CustomerList @edit="openEditDialog" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn color="primary" @click="openCreateDialog">ایجاد مشتری جدید</v-btn>
      </v-col>
    </v-row>

    <!-- دیالوگ ایجاد/ویرایش مشتری -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>{{ editingCustomerId ? 'ویرایش مشتری' : 'ایجاد مشتری جدید' }}</v-card-title>
        <v-card-text>
          <v-text-field variant="outlined"hide-details label="نام مشتری" class='my-1'  v-model="form.full_name" />
          <v-text-field variant="outlined" hide-details label="شماره همراه" class='my-1'  v-model="form.mobile_number" />
          <v-text-field variant="outlined" hide-details label="شهر" class='my-1'  v-model="form.city" />
          <v-text-field variant="outlined" hide-details class='my-1' label="شغل" v-model="form.job" />
          
          <v-checkbox label="عمومی" v-model="form.is_public"    />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog">انصراف</v-btn>
          <v-btn color="primary" @click="submitCustomer">
            {{ editingCustomerId ? 'ویرایش' : 'ایجاد' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import CustomerList from '@/components/CustomerList.vue';
import { useCustomerStore } from '@/stores/customer';
import { useToast } from 'vue-toastification';

const toast = useToast();


const dialogVisible = ref(false);
const editingCustomerId = ref(null);
const form = ref({ full_name: '', is_public: false });

const customerStore = useCustomerStore();

function openCreateDialog() {
  editingCustomerId.value = null;
  form.value = { full_name: '', is_public: false };
  dialogVisible.value = true;
}

function openEditDialog(customer) {
  console.log(customer)
  editingCustomerId.value = customer.id;
  form.value = {
    full_name: customer.full_name,
    is_public: !!customer.is_public,
    mobile_number: customer.mobile_number,
    city: customer.city,
    job: customer.job,
    user_id: customer.user_id,
  };
  dialogVisible.value = true;
}

function closeDialog() {
  dialogVisible.value = false;
  form.value = { full_name: '', is_public: false };
  editingCustomerId.value = null;
}

async function submitCustomer() {
  
  
  if (!form.value.full_name.trim()) return toast.error('نام مشتری نمی‌تواند خالی باشد');
  try{

  
  if (editingCustomerId.value) {
     const res = await customerStore.customerUpdate(editingCustomerId.value, {
      full_name: form.value.full_name,
      is_public: form.value.is_public,
       mobile_number: form.value.mobile_number,
      job: form.value.job,
      city: form.value.city,
      user_id:form.value.user_id
    });
    await customerStore.loadCustomers();
    toast.success("مشتری با موفقیت ویرایش شد");


  } else {

    await customerStore.addCustomer({
      full_name: form.value.full_name,
      is_public: form.value.is_public,
      mobile_number: form.value.mobile_number,
      job: form.value.job,
      city: form.value.city,
    });
    await customerStore.loadCustomers(); // ⬅️ بارگزاری دوباره لیست
toast.success("مشتری با موفقیت اضافه شد");
  }

  closeDialog();
}catch (err) {
    console.log("یسشیسش")
    const response = err;
    console.log(err)

    if (response && response.status === 422 ) {
      const messages = Object.values(response.response.data).flat();
      toast.error(messages.join('، '));
    } else if (response && response.status === 403) {
      toast.error('دسترسی غیرمجاز');
    } else {
      toast.error('خطایی در ثبت اطلاعات رخ داد');
    }

  }
  }

</script>
