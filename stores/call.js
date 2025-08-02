// 📁 src/stores/call.js
import { defineStore } from 'pinia';
import { fetchCalls, createCall,  detailsCall ,downloadCall} from '@/api/call';

export const useCallStore = defineStore('call', {
  state: () => ({
    calls: [],
    totalItems: 0,
    filters: {
      start: '',
      end: '',
      user_id: '',
      disposition: '',
      contact_call_source: false,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async loadCalls(options) {
      this.loading = true;
      
      try {
        const params = {
          per_page: options?.per_page ?? 10,
          page: options?.page ?? 1,
          sort_by: options?.sortBy?.[0] ?? null,
          sort_desc: options?.sortDesc?.[0] ?? false,
          filter: {
            start: this.filters.start,
            end: this.filters.end,
            user_id: this.filters.user_id,
            disposition: this.filters.disposition,
            contact_call_source: this.filters.contact_call_source,
          },
        };

        const res = await fetchCalls(params);
        console.log(res,"store")
        this.calls = res.data.data;
        this.totalItems = res.data.meta.total || 0;
        return res;
      } catch (err) {
        console.log(err,"err store")
        this.error = err.message;
        return { data: [], meta: { total: 0 }, error: err.status };
      } finally {
        this.loading = false;
      }
    },

    async getCall(id) {
      try {
        const res = await detailsCall(id);
        console.log("Dasdassadsadsaa")
        return res.data.data;
      } catch (err) {
        console.log(err,"a")
        return { error: err.status };
      }
    },

    async callUpdate(id, data) {
      try {
        return await updateCall(id, data);
      } catch (err) {
        return {
          error: err.response?.status || 500,
          data: err.response?.data || 'خطای ناشناخته',
        };
      }
    },
    
    async callDownload( data) {
      try {
        return await downloadCall(data);
      } catch (err) {
        return {
          error: err.response?.status || 500,
          data: err.response?.data || 'خطای ناشناخته',
        };
      }
    },

    async callCreate(data) {
      try {
        return await createCall(data);
      } catch (err) {
        return { error: err.status, data: err.response?.data };
      }
    },

    async callDelete(id) {
      try {
        return await deleteCall(id);
      } catch (err) {
        return { error: err.status };
      }
    },
  },
});
