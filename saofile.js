const fs = require('fs');
const path = require('path')
// const { join } = require('path')
const superb = require('superb')
const glob = require('glob')
const spawn = require('cross-spawn')
const validate = require('validate-npm-package-name')

module.exports = {
  prompts: [
    {
      name: 'name',
      message: 'Project name',
      default: '{outFolder}'
    },
    {
      name: 'description',
      message: 'Project description',
      default: `My ${superb()} Nuxt.js project`
    },
    // {
    //   name: 'server',
    //   message: 'Use a custom server framework',
    //   type: 'list',
    //   choices: [
    //     'none',
    //     'express',
    //     'koa',
    //     'adonis',
    //     'hapi',
    //     'feathers',
    //     'micro',
    //     'fastify'
    //   ],
    //   default: 'none'
    // },
    {
      name: 'features',
      message: 'Choose features to install',
      type: 'checkbox',
      choices: [
        {
          name: 'Progressive Web App (PWA) Support',
          value: 'pwa'
        },
        {
          name: 'Linter / Formatter',
          value: 'linter'
        },
        {
          name: 'Prettier',
          value: 'prettier'
        }//,
        // {
        //   name: 'Axios',
        //   value: 'axios'
        // }
      ],
      default: []
    },
    {
      name: 'ui',
      message: 'Use a custom UI framework',
      type: 'list',
      choices: [
        'none',
        'bootstrap',
        'vuetify',
        'bulma',
        'tailwind',
        'element-ui',
        'buefy',
        'ant-design-vue',
        'iview',
        'tachyons'
      ],
      default: 'none'
    },
    // {
    //   name: 'test',
    //   message: 'Use a custom test framework',
    //   type: 'list',
    //   choices: [
    //     'none',
    //     'jest',
    //     'ava'
    //   ],
    //   default: 'none'
    // },
    // {
    //   name: 'mode',
    //   message: 'Choose rendering mode',
    //   type: 'list',
    //   choices: [
    //     { name: 'Universal', value: 'universal' },
    //     { name: 'Single Page App', value: 'spa' }
    //   ],
    //   default: 'universal'
    // },
    {
      name: 'author',
      type: 'string',
      message: 'Author name',
      default: '{gitUser.name}',
      store: true
    },
    {
      name: 'pm',
      message: 'Choose a package manager',
      choices: ['npm', 'pnpm', 'yarn'],
      type: 'list',
      default: 'npm'
    }
  ],
  templateData() {
    const edge = process.argv.includes('--edge')
    const pwa = this.answers.features.includes('pwa')
    const linter = this.answers.features.includes('linter')
    const prettier = this.answers.features.includes('prettier')
    // const axios = this.answers.features.includes('axios')
    const esm = this.answers.server === 'none'
    // const install = process.argv[3] || 'module'
    const installType = (this.outDir.indexOf('nuxt\\modules\\')) !== -1 ? 'module' : 'project'
    const installPath = (installType === 'module') ? 'modules/' + this.outFolder : this.outFolder
    
    return {
      edge,
      pwa: pwa ? 'yes' : 'no',
      eslint: linter ? 'yes' : 'no',
      prettier: prettier ? 'yes' : 'no',
      // axios: axios ? 'yes' : 'no',
      axios: 'yes',
      esm,
      server: 'none',
      test: 'none',
      mode: 'universal',
      // install: install.startsWith('p') ? 'project' : 'module'
      installPath: installPath
    }
  },
  actions() {
    const validation = validate(this.answers.name)
    validation.warnings && validation.warnings.forEach((warn) => {
      console.warn('Warning:', warn)
    })
    validation.errors && validation.errors.forEach((err) => {
      console.error('Error:', err)
    })
    validation.errors && validation.errors.length && process.exit(1)

    const installType = (this.outDir.indexOf('nuxt\\modules\\')) !== -1 ? 'module' : 'project'
    const installModulePrefix = (installType === 'module') ? '../' : ''

    const actions = [{
      type: 'add',
      files: '**',
      templateDir: 'template/nuxtCore',
      filters: {
        'static/icon.png': 'features.includes("pwa")'
      }
    }]

    if (this.answers.ui !== 'none') {
      actions.push({
        type: 'add',
        files: '**',
        templateDir: `template/frameworks/${this.answers.ui}`
      })
    }
    
    actions.push({
      type: 'add',
      files: '*',
      filters: {
        '_.eslintrc.js': 'features.includes("linter")',
        '.prettierrc': 'features.includes("prettier")'
      }
    })
    
    actions.push({
      type: 'move',
      patterns: {
        // gitignore: '.gitignore',
        '_package.json': 'package.json',
        '_.eslintrc.js': '.eslintrc.js',
        'pos.generate.js': installModulePrefix + '../pos.generate.js',
        'pos.loader.js': installModulePrefix + '../pos.loader.js'
      }
    })
    
    // PlatformOS Marketplace Builder
    const marketplaceKitPath = path.resolve(this.outDir, installModulePrefix + '../../.marketplace-kit')
    let marketplaceKit
    try {
      marketplaceKit = JSON.parse(fs.readFileSync(marketplaceKitPath, 'utf-8'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('ERROR: .marketplace-kit not found! See https://documentation.platform-os.com/get-started/deploying-syncing-changes Step 2: Authenticate environments. Complete this step and try again.')
        process.exit()
      } else {
        throw err
      }
    }

    const marketplaceBuilderPath = path.resolve(this.outDir, installModulePrefix + '../../marketplace_builder/')
    const modulePath = path.resolve(marketplaceBuilderPath + 'modules/' + this.answers.name + '/nuxt_src')
    const projectPath = path.resolve(marketplaceBuilderPath + 'nuxt_src')
    const gitignorePath = path.resolve(this.outDir, installModulePrefix + '../../.gitignore')
    const dotenvPath = path.resolve(this.outDir, installModulePrefix + '../../.env')

    if ( installType === 'module' && !fs.existsSync(modulePath) ) {
      
      actions.push({
        type: 'add',
        files: '**',
        templateDir: `template/platformos/module`
      })
      
      actions.push({
        type: 'move',
        patterns: {
          'private': installModulePrefix + '../../marketplace_builder/modules/' + this.answers.name + '/private',
          'public': installModulePrefix + '../../marketplace_builder/modules/' + this.answers.name + '/public'
        }
      }) 
      
      actions.push({
        type: 'add',
        files: '**',
        templateDir: `template/nuxtSrc/module`
      })

      actions.push({
        type: 'move',
        patterns: {
          'nuxt_src': installModulePrefix + '../../marketplace_builder/modules/' + this.answers.name + '/nuxt_src'
        }
      })

    } else if ( installType === 'project' && !fs.existsSync(projectPath) ) {
      actions.push({
        type: 'add',
        files: '**',
        templateDir: `template/platformos/project`
      })
      
      actions.push({
        type: 'move',
        patterns: {
          'marketplace_builder': '../../marketplace_builder',
        }
      }) 
      
      actions.push({
        type: 'add',
        files: '**',
        templateDir: `template/nuxtSrc/project`
      })

      actions.push({
        type: 'move',
        patterns: {
          'nuxt_src': '../../marketplace_builder/nuxt_src'
        }
      })

    } else {
      console.log(this.chalk.bold(`\n${this.chalk.red('ERROR:')} Name already exist. Try again using a different name.`))
      process.exit()
    }
    
    if (!fs.existsSync(gitignorePath)) {      
      actions.push({
        type: 'move',
        patterns: {
          gitignore: installModulePrefix + '../../.gitignore'
        }
      })
    }
    
    if (!fs.existsSync(dotenvPath)) {
      actions.push({
        type: 'move',
        patterns: {
          '.env': installModulePrefix + '../../.env'
        }
      })
    }

    const stagingUrl = 'staging' in marketplaceKit ? marketplaceKit.staging.url : 'stagingUrl'
    const productionUrl = 'production' in marketplaceKit ? marketplaceKit.production.url : 'productionUrl'
    actions.push({
      type: 'modify',
      files: installModulePrefix + '../../.env',
      handler(data) {
        data = data.replace("stagingUrl", stagingUrl)
        data = data.replace("productionUrl", productionUrl)
        return data
      }
    })

    return actions
  },
  async completed() {
    this.gitInit()

    await this.npmInstall({ npmClient: this.answers.pm })

    const installModule = this.outDir.indexOf('nuxt\\modules\\') !== -1 ? 'modules/' : ''
    const isNewFolder = this.outDir !== process.cwd()
    const cd = () => {
      if (isNewFolder) {
        console.log(`\t${this.chalk.cyan('cd')} nuxt/` + installModule + `${this.outFolder}`)
      }
    }

    if (this.answers.features.includes('linter')) {
      const options = ['run', 'lint', '--', '--fix']
      if (this.answers.pm === 'yarn') {
        options.splice(2, 1)
      }
      spawn.sync(this.answers.pm, options, {
        cwd: this.outDir,
        stdio: 'inherit'
      })
    }

    console.log()
    console.log(this.chalk.bold(`  To get started:\n`))
    cd()
    console.log(`\t${this.answers.pm} run dev\n`)
    console.log(this.chalk.bold(`  To generate for staging & production:\n`))
    cd()
    console.log(`\t${this.answers.pm} run staging`)
    console.log(`\t${this.answers.pm} run production`)
    // console.log(`\t${this.answers.pm} start`)

    // if (this.answers.test !== 'none') {
    //   console.log(this.chalk.bold(`\n  To test:\n`))
    //   cd()
    //   console.log(`\t${this.answers.pm} run test`)
    // }
    console.log()
  }
}
