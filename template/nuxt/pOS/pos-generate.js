const cheerio = require('cheerio')
const fs = require('fs')
const minify = require('html-minifier').minify

module.exports = function(page) {

  // SETTINGS
  const alwaysIncludeGlobals = process.env.alwaysIncludeGlobals
  const minifyHTML = process.env.minifyHTML

  
  // Set page file url without extension
  let pageFile = ( page.path.replace('.html', '') )
      pageFile = pageFile.replace(/\\/g,'/')
  
  // Load page HTML into Cheerio
  const $ = cheerio.load(page.html, { normalizeWhitespace: false, decodeEntities: false })
   
  // load pos block into Cheerio
  const vuePath = ('../marketplace_builder/nuxt/pages' + pageFile + '.vue' )  
  const pos = cheerio.load(fs.readFileSync(vuePath), { })

  // PAGE HTML //
  
  //Replace the vue asset urls for pOS asset_url 
  let asset_urls = function (el,attr) {

    $(el).each( function () {

      let vueUrl = $(this).attr(attr) + ''

      if (~vueUrl.indexOf("assets/_nuxt/")) {
        let replace = vueUrl.split('assets/_nuxt/')
        let asset_url = "{{ '_nuxt/" + replace[1] + "' | asset_url }}"

        $(this).attr(attr, asset_url)
      }

    });

  }

  asset_urls('script','src')
  asset_urls('link','href')
  asset_urls('img','src')


  // Add console log of context in staging environments
  const contextLog = () => {
    $('body').append(
      '{%- if context.environment contains "staging" -%}' +
      '<script>console.log( "--- Context JSON ---", {{context | json}} )</script>' +
      '{%- endif -%}'
    ) 
  }
  
  if (process.env.POS_ENV !== 'production') {
    contextLog()
  }


  const getState = () => {  
    // let __nuxt__ = $('script:contains("window.__NUXT__")').contents().first().text()
    // __nuxt__ = __nuxt__.replace('window.__NUXT__=','')

    // __nuxt__ = JSON.parse(JSON.stringify({__nuxt__}))

    // const obj = {state:{globals:{},pages_index:{name:"test Name"},pages_test:{}}}

    // let nuxtState = new Map(Object.entries(obj))
    //     nuxtState = nuxtState.get('state')

    // let includePartials = ''
    //     Object.keys(nuxtState).forEach(key => {
    //       let includeKey = key.replace('_','/')
    //       includePartials = includePartials + '{%- include "' + includeKey + '" -%}'
    //     })
  }


  // Get pos block content
  let posContents = pos('pos').contents().first().text().trimLeft()
  posContents = posContents.split('---')

  // Page Liquid Contents
  let includeGlobals = ''
  
  if ( alwaysIncludeGlobals === 'true' ) {
    includeGlobals = '{%- include "globals" -%}'
  }
  
  // generate plaftormOS page frontMatter
  const frontMatter_Liquid = '---' + posContents[1] + '---\n' + includeGlobals + '{%- include "pages' + pageFile + '" -%}\n'

  // HTML minification
  let pageHTML
  
  if ( minifyHTML === 'true' ) {  
    
    pageHTML = minify($.html(), {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      conservativeCollapse: false
    })
    
  } else {
    
    pageHTML = $.html()
    
  }
  
  //Re-compile the html with yaml at the top
  page.html = frontMatter_Liquid + pageHTML
  
  //Set the path and filename ready for pOS
  page.path = '../../views/pages' + page.path + '.liquid'
  

   
  // VARIABLE LIQUID PARTIAL //
  const partialPath = '../marketplace_builder/views/partials/pages'
  const partialFile = partialPath + pageFile + '.liquid'

  const partialContent = posContents[2].trim()
  
  
  // API LIQUID JSON //
  const jsonPath = '../marketplace_builder/views/pages'
  const jsonFile = jsonPath + pageFile + '.json.liquid'

  let jsonYAML = posContents[1].replace('slug: ','slug: api/pages/' )
      jsonYAML = jsonYAML.replace('slug: api/pages//', 'slug: api/pages/index')
  
  const jsonContent = '---' + jsonYAML + '---\n'
      + '{%- include "pages' + pageFile + '" -%}\n'
      + '{{ context.exports.pages' + pageFile.replace(/\//g, '\_') + ' | json }}'


  // WRTIE FILES TO marketplace_builder
  let writeFile = (path, file, content) => {
  
    fs.mkdir(path + page.route, { recursive: true }, (err) => {
      // if (err) throw err
      fs.writeFileSync( file, content)
    })
    
  }

  writeFile(partialPath, partialFile, partialContent)
  writeFile(jsonPath, jsonFile, jsonContent)
      
      
}