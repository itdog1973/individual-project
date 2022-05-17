import { renderCat } from './category.js'
import * as regUtils from './register.js' 
import * as logUtils from './login.js' 
import * as logoutUtils from './logout.js'
import * as postUtils from './startPost.js'
import * as postInit  from './post.js'
regUtils.initRegForm()
logUtils.initLogForm()
logoutUtils.logout()
postUtils.openPost()
postInit.getPost()
renderCat()



