export default function ({store, route, $axios}) {
    if ( process.env.NODE_ENV === 'development') {

        return $axios.$get('pages' + route.path + '/index.json')
        .then( res => {
            
            store.registerModule('pages-' + route.name, {
                
                namespaced: true,
                state: res,
                mutations: {
                    
                    pOS(state, res ) {

                        Object.keys(res).forEach(function(key){
                            state[key] = res[key]
                        })     
                    }   
                }
                
            }) 
            
            store.commit('pages-' + route.name + '/pOS', res )

        })
    
    }
}