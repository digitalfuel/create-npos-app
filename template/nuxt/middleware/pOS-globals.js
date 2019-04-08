export default function ({store, $axios}) {
    if ( process.env.NODE_ENV !== 'production') {

        return $axios.$get('pages/globals.json')
        .then( res => {
            
            store.registerModule('globals', {
                
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
            
            store.commit('globals' + '/pOS', res )

        })
    
    }
}