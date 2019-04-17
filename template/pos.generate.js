const fs = require('fs')

const installPath = process.env.POS_INSTALL_PATH
const nodePath = './' + installPath + '/node_modules/'
const cheerio = require( nodePath + 'cheerio')
const minify = require( nodePath + 'html-minifier').minify
const pkg = require( './' + installPath + '/package')
const installType = (installPath.startsWith('modules/')) 
      ? 'module'
      : 'package'


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
  const vuePath = (installType !== 'module')
        ? '../../marketplace_builder/nuxt_src/pages' + pageFile + '.vue'
        : '../../../marketplace_builder/' + installPath + '/nuxt_src/pages' + pageFile + '.vue'
  const pos = cheerio.load(fs.readFileSync(vuePath), { })

  // Get pos block content
  let posContents = pos('pos').contents().first().text().trimLeft()
  posContents = posContents.split('---')
  
  let posPage = posContents[0].replace(/\r?\n/g, ";").replace(/ /g,'')

  posPage = posPage.split(';')

  let private = posPage[0]
      private = private.split('=')
      private = private[1]

  privacy = private || 'true'
  
  // Create priacy path to public or private
  let privacyPath = ( privacy !== 'true' ) ? 'public/' : 'private/' 
  // Create module path
  let modulePath = 'modules/' + pkg.name + '/'

  if (installType !== 'module') {
    privacyPath = ''
    modulePath = ''
  }


  // PAGE HTML //
  
  //Replace the vue asset urls for pOS asset_url 
  let asset_urls = function (el,attr) {

    $(el).each( function () {

      let vueUrl = $(this).attr(attr) + ''

      if (~vueUrl.indexOf("assets/_nuxt/")) {
        let replace = vueUrl.split('assets/_nuxt/')
        let asset_url = "{{ '" + modulePath + "_nuxt/" + replace[1] + "' | asset_url }}"

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

  // Page Liquid Contents
  let includeGlobals = ''
  
  if ( alwaysIncludeGlobals === 'true' ) {
    includeGlobals = '{%- include "' + modulePath + 'globals" -%}'
  }
  
  // generate plaftormOS page frontMatter
  const frontMatter_Liquid = '---' + posContents[1] + '---\n' + includeGlobals + '{%- include "' + modulePath + 'pages' + pageFile + '" -%}\n'

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
  const partialPath = (installType !== 'module')
        ? '../../marketplace_builder/views/partials/pages'
        : '../../../marketplace_builder/' + installPath + '/' + privacyPath + 'views/partials/pages'
  const partialFile = partialPath + pageFile + '.liquid'

  const partialContent = posContents[2].trim()
  
  
  // API LIQUID JSON //
  const jsonPath = (installType !== 'module')
        ? '../../marketplace_builder/views/pages'
        : '../../../marketplace_builder/' + installPath + '/' + privacyPath + 'views/pages'
  const jsonFile = jsonPath + pageFile + '.json.liquid'

  let jsonYAML = posContents[1].replace('slug: ','slug: api/pages/' )
      jsonYAML = jsonYAML.replace('slug: api/pages//', 'slug: api/pages/index')
  
  let pagesStr = pageFile.replace(/\//g, '\-')
  let pagesStrEnd = ( pagesStr.lastIndexOf('-index') !== -1 ) ? pagesStr.lastIndexOf('-index') : pagesStr.length
      pagesStrEnd = ( pagesStrEnd === 0 ) ? 6 : pagesStrEnd
      pagesStr = pagesStr.substr(0, pagesStrEnd)

  const jsonContent = '---' + jsonYAML + '---\n'
      + '{%- include "' + modulePath + 'pages' + pageFile + '" -%}\n'
      + '{{ context.exports.pages' + pagesStr + ' | json }}'


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