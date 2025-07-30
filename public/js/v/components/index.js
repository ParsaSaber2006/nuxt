// import Login from "./login/Login.vue";

// import Card from "./appComponents/Card.vue";
import AppProgress from "./appComponents/AppProgress.vue";
// import LoadingWait from "./appComponents/LoadingWait.vue";
import BreadcrumbsAuto from "./appComponents/BreadcrumbsAuto.vue";
import Breadcrumbs from "./appComponents/Breadcrumbs.vue";

const components = [
    BreadcrumbsAuto,
    Breadcrumbs,
    AppProgress,
]
async function discoverComponents(app) {

    components.forEach((component)=>{
        console.log(component,component.name);
        app.component(component.name, component)
    })
   
    /*  const components = import.meta.globEager('./*.vue')
     Object.entries(components).forEach(([path, definition]) => {
         const componentName = path.split('/').pop().replace(/\.\w+$/, '')
         app.component(componentName, definition.default)
     }) */
}

export default discoverComponents;