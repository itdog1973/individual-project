import { renderCat } from './category.js'
import * as logoutUtils from './logout.js'
import * as postUtils from './startPost.js'

import * as postInit  from './post.js'
import { checkCat } from './cat.js'
import { initSearch } from './search.js'
import track from './track.js'
checkCat()
initSearch()

// regUtils.initRegForm()
// logUtils.initLogForm()

logoutUtils.logout()

postUtils.openPost()
postInit.getObserver()
track();
// postInit.getPost()

renderCat()








