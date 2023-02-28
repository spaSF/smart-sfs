environments {
	development {
		modules = {
			smartsfs{
				resource url: '/isomorphic/system/modules-debug/ISC_Core.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_Foundation.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_Containers.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_Grids.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_Forms.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_DataBinding.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_Calendar.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_History.js', disposition: 'head'
				resource url: '/isomorphic/system/modules-debug/ISC_RichTextEditor.js', disposition: 'head'
			}
			scapplication {
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scLogin.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scGlobal.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scRestDataSource.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scFormItems.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scTabset.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scUser.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scApplication.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scLocale.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scGrid.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scDetail.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'scButtons.js']
		      resource url:[plugin:'smart-sfs', dir: 'js', file: 'scCalendar.js']
				resource url:[plugin:'smart-sfs', dir: 'js', file: 'smart-sfs.js']
			}
		}
	}
	test {
		modules = {
			smartsfs{
				resource url: '/isomorphic/system/modules/ISC_Core.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Foundation.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Containers.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Grids.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Forms.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_DataBinding.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Calendar.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_History.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_RichTextEditor.js', disposition: 'head'
			}
			scapplication {
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scLogin.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scGlobal.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scRestDataSource.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scFormItems.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scTabset.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scUser.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scApplication.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scLocale.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scGrid.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scDetail.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scButtons.js']
		      resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scCalendar.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'smart-sfs.js']
			}
		}
	}
	production {
		modules = {
			smartsfs{
				resource url: '/isomorphic/system/modules/ISC_Core.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Foundation.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Containers.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Grids.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Forms.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_DataBinding.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_Calendar.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_History.js', disposition: 'head'
				resource url: '/isomorphic/system/modules/ISC_RichTextEditor.js', disposition: 'head'
			}
			scapplication {
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scLogin.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scGlobal.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scRestDataSource.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scFormItems.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scTabset.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scUser.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scApplication.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scLocale.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scGrid.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scDetail.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scButtons.js']
            resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'scCalendar.js']
				resource url:[plugin:'smart-sfs', dir: 'js/min', file: 'smart-sfs.js']
			}
		}
	}
}