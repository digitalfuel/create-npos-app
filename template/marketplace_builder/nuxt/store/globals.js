export const state = () => ({
    authenticity_token: '{{ context.authenticity_token }}', //IMPORTANT! Only comment if CSRF is not needed
    //Custom Globals
    company: '{{ context.exports.globals.company }}'
})

export const mutations = {
}

export const actions = {
}