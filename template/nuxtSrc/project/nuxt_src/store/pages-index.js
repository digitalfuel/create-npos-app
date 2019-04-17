export const state = () => ({
    description: '{{ context.exports.pages-index.description }}'
})

export const mutations = {
    pOS(state, res ) {
        Object.keys(res).forEach(function(key){
            state[key] = res[key]
        })
    }
}

export const actions = {
}