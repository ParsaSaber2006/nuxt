import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue';

export const useOptionsStore = defineStore('options', () => {

    // states
    const
        storedOptions = ref(null)

    // getters
    const
        options = computed(() => storedOptions.value ?? {}),
        optionsLoaded = computed(() => storedOptions.value !== null);

    //actions
    async function getOptionsFromServer() {
        const { data } = await axios.get("/api/options")
        storedOptions.value = data
    }

    async function update(options) {
        await axios.put("/api/options", options);
        resetStoreOptions();

    }

    async function resetStoreOptions() {
        storedOptions.value = JSON.parse(JSON.stringify(options))
    }
    
    function get(key, def) {
        return options.value[key] ?? def;
    }

    function getMedia(key, def) {

        if (!options.value.hasOwnProperty('medias')) {
            return def;
        }

        return options.value.medias[key] ?? def;

    }

    return {
        options,
        optionsLoaded,
        get,
        getMedia,
        update,
        getOptionsFromServer,
        resetStoreOptions
    }
})