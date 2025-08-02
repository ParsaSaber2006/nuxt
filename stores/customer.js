
import { defineStore } from 'pinia';
import { fetchCustomers, createCustomer,updateCustomer,deleteCustomer } from '@/api/customer';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    
    customers: [],
    pagination: {
      page: 1,
      itemsPerPage: 10,
      total: 0,
    },
filters: {
  full_name: '',
  city: [],
  job: [],
    },
    sort: {
      key: 'id',
      order: 'desc',
    },
    loading: false,
    error: null,
  allCities: [],
  allJobs: [],
  }),



getters: {
  filteredCustomers(state) {
    return state.customers.filter(customer => {
      const matchString = (key, val) => !val || customer[key]?.toLowerCase().startsWith(val.toLowerCase());
      const matchArray = (key, vals) => !vals.length || vals.includes(customer[key]);
      return (
        matchString('full_name', state.filters.full_name) &&
        matchArray('job', state.filters.job) &&
        matchArray('city', state.filters.city) 
      );
    });
  },
},

  actions: {
    
    async initFilterOptions() {
  try {
    const res = await fetchCustomers({ per_page: 1000 }); // اگر زیادن صفحه‌بندی‌شده بگیر
    const allCities = new Set();
    const allJobs = new Set();

    res.data.data.forEach((c) => {
      if (c.city) allCities.add(c.city);
      if (c.job) allJobs.add(c.job);
    });

    this.allCities = [...allCities];
    this.allJobs = [...allJobs];
  } catch (err) {
    console.error("خطا در گرفتن اطلاعات اولیه:", err);
  }
},

async loadCustomers(options = null) {
    this.loading = true;
    try {
      const params = {
        per_page: options?.itemsPerPage ?? 10,
        page: options?.page ?? 1,
        // اگر sortBy وجود دارد
        sort_by: options?.sortBy?.[0] ?? null,
        sort_desc: options?.sortDesc?.[0] ?? false,
        filter : {
          'job':this.filters.job,
          'city':this.filters.city,
          'full_name':this.filters.full_name,
          
        },
      };
      console.log(params);
      const res = await fetchCustomers(params);

      this.customers = res.data.data;
      this.totalItems = res.data.meta.total || 0;

      return res.data;
    } catch (err) {
      this.error = err.message;
      return { data: [], meta: { total: 0 } };
    } finally {
      this.loading = false;
    }
  },

    async addCustomer(data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await createCustomer(data);
        console.log(res.data)
        // this.customers.push(res.data);
      } catch (err) {
        
        console.log(err)
        this.error = err.message || 'خطا در ایجاد مشتری';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    setPage(page) {
      this.pagination.page = page;
      this.loadCustomers();
    },

   setSort({ sortBy = [], sortDesc = [] }) {
  this.sort.key = sortBy[0] || 'id';
  this.sort.order = (sortDesc && sortDesc[0]) ? 'desc' : 'asc';
  this.loadCustomers();
},
async customerUpdate(id,data){
      this.loading = true;
      this.error = null;
      console.log(data,"store")
 try {
        return  await updateCustomer(id,data);
        console.log(res.data)
        // this.customers.push(res.data);
      } catch (err) {
        
        console.log(err)
        this.error = err.message || 'خطا در ایجاد مشتری';
        throw err;
      } finally {
        this.loading = false;
      }

},


  //delete

  async customerDelete(id){
     return await deleteCustomer(id);
  }
  },

  //update 

});
