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
                            // console.log(key + ' - ' + res[key]);
                            state[key] = res[key]
                        })
                        
                    }

                    // pOS(state, { key, result } ) {
                        
                    //     state[key] = result
                        
                    // }
                    
                }

                
            }) 
            
            store.commit('globals' + '/pOS', res )

            // for (const key in store.state['globals']) {
            //     let result = res[key]
                
            //     if ( store.state['globals'][key].startsWith("{{") ) {

            //         store.commit('globals' + '/pOS', { key, result } )

            //     }
            // }

        })
        // .catch(e => isContext.error(e))
        
    }

}