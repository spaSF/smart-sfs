isc.ClassFactory
		.defineClass("Lokalizacia")
		.addClassProperties(
				{
					setLocale : function(lc, cbk) {
						if (!lc) lc = "*";
						var auth = null;
						if (App.get.locale != lc) {
							App
									.dataRequest(
											App.localeRequestUrl,
											{
												locale : lc
											},
											function(resp, data) {
												var ret = data;// isc.JSON.decode(data);
												if (ret.response.status == 0) {
													isc.i18nMessages = ret.response.data;
													lc = ret.response.locale ? ret.response.locale : lc
													auth = ret.response.auth ? ret.response.auth : {}
													App.get.config = ret.response.config?ret.response.config:{}
												}
												if(isc.Dialog) {
												    if(isc.i18nMessages.dialog_OkButtonTitle) isc.Dialog.addClassProperties({OK_BUTTON_TITLE: isc.i18nMessages.dialog_OkButtonTitle});
												    if(isc.i18nMessages.dialog_ApplyButtonTitle) isc.Dialog.addClassProperties({APPLY_BUTTON_TITLE: isc.i18nMessages.dialog_ApplyButtonTitle});
												    if(isc.i18nMessages.dialog_YesButtonTitle) isc.Dialog.addClassProperties({YES_BUTTON_TITLE: isc.i18nMessages.dialog_YesButtonTitle});
												    if(isc.i18nMessages.dialog_NoButtonTitle) isc.Dialog.addClassProperties({NO_BUTTON_TITLE: isc.i18nMessages.dialog_NoButtonTitle});
												    if(isc.i18nMessages.dialog_CancelButtonTitle) isc.Dialog.addClassProperties({CANCEL_BUTTON_TITLE: isc.i18nMessages.dialog_CancelButtonTitle});
												    if(isc.i18nMessages.dialog_DoneButtonTitle) isc.Dialog.addClassProperties({DONE_BUTTON_TITLE: isc.i18nMessages.dialog_DoneButtonTitle});
												    if(isc.i18nMessages.dialog_ConfirmTitle) isc.Dialog.addClassProperties({CONFIRM_TITLE: isc.i18nMessages.dialog_ConfirmTitle});
												    if(isc.i18nMessages.dialog_SayTitle) isc.Dialog.addClassProperties({SAY_TITLE: isc.i18nMessages.dialog_SayTitle});
												    if(isc.i18nMessages.dialog_WarnTitle) isc.Dialog.addClassProperties({WARN_TITLE: isc.i18nMessages.dialog_WarnTitle});
												    if(isc.i18nMessages.dialog_AskTitle) isc.Dialog.addClassProperties({ASK_TITLE: isc.i18nMessages.dialog_AskTitle});
												    if(isc.i18nMessages.dialog_AskForValueTitle) isc.Dialog.addClassProperties({ASK_FOR_VALUE_TITLE: isc.i18nMessages.dialog_AskForValueTitle});
												    if(isc.i18nMessages.dialog_LoginTitle) isc.Dialog.addClassProperties({LOGIN_TITLE: isc.i18nMessages.dialog_LoginTitle});
												    if(isc.i18nMessages.dialog_UserNameTitle) isc.Dialog.addClassProperties({USERNAME_TITLE: isc.i18nMessages.dialog_UserNameTitle});
												    if(isc.i18nMessages.dialog_PasswordTitle) isc.Dialog.addClassProperties({PASSWORD_TITLE: isc.i18nMessages.dialog_PasswordTitle});
												    if(isc.i18nMessages.dialog_LoginButtonTitle) isc.Dialog.addClassProperties({LOGIN_BUTTON_TITLE: isc.i18nMessages.dialog_LoginButtonTitle});
												    if(isc.i18nMessages.dialog_LoginErrorMessage) isc.Dialog.addClassProperties({LOGIN_ERROR_MESSAGE: isc.i18nMessages.dialog_LoginErrorMessage});
												}
												if(isc.BatchUploader) {
												    if(isc.i18nMessages.batchUploader_uploadButtonTitle) isc.BatchUploader.addProperties({uploadButtonTitle: isc.i18nMessages.batchUploader_uploadButtonTitle});
												    if(isc.i18nMessages.batchUploader_uploadFileLabel) isc.BatchUploader.addProperties({uploadFileLabel: isc.i18nMessages.batchUploader_uploadFileLabel});
												    if(isc.i18nMessages.batchUploader_commitConfirmationMessage) isc.BatchUploader.addProperties({commitConfirmationMessage: isc.i18nMessages.batchUploader_commitConfirmationMessage});
												    if(isc.i18nMessages.batchUploader_discardedColumnsMessage) isc.BatchUploader.addProperties({discardedColumnsMessage: (isc.i18nMessages.batchUploader_discardedColumnsMessage).replace(/(\$discardedColumns)/g, '${discardedColumns}')});
												    if(isc.i18nMessages.batchUploader_allRecordsInErrorMessage) isc.BatchUploader.addProperties({allRecordsInErrorMessage: isc.i18nMessages.batchUploader_allRecordsInErrorMessage});
												    if(isc.i18nMessages.batchUploader_partialCommitConfirmationMessage) isc.BatchUploader.addProperties({partialCommitConfirmationMessage: isc.i18nMessages.batchUploader_partialCommitConfirmationMessage});
												    if(isc.i18nMessages.batchUploader_updatesRolledBackMessage) isc.BatchUploader.addProperties({updatesRolledBackMessage: isc.i18nMessages.batchUploader_updatesRolledBackMessage});
												    if(isc.i18nMessages.batchUploader_partialCommitPrompt) isc.BatchUploader.addProperties({partialCommitPrompt: isc.i18nMessages.batchUploader_partialCommitPrompt});
												    if(isc.i18nMessages.batchUploader_partialCommitError) isc.BatchUploader.addProperties({partialCommitError: isc.i18nMessages.batchUploader_partialCommitError});
												    if(isc.i18nMessages.batchUploader_cancelConfirmMessage) isc.BatchUploader.addProperties({cancelConfirmMessage: isc.i18nMessages.batchUploader_cancelConfirmMessage});
												    if(isc.i18nMessages.batchUploader_commitButtonTitle) isc.BatchUploader.addProperties({commitButtonTitle: isc.i18nMessages.batchUploader_commitButtonTitle});
												    if(isc.i18nMessages.batchUploader_cancelButtonTitle) isc.BatchUploader.addProperties({cancelButtonTitle: isc.i18nMessages.batchUploader_cancelButtonTitle});
												    if(isc.i18nMessages.batchUploader_errorMessageFileIsBlank) isc.BatchUploader.addProperties({errorMessageFileIsBlank: isc.i18nMessages.batchUploader_errorMessageFileIsBlank});
												    if(isc.i18nMessages.batchUploader_errorMessageUnterminatedQuote) isc.BatchUploader.addProperties({errorMessageUnterminatedQuote: (isc.i18nMessages.batchUploader_errorMessageUnterminatedQuote).replace(/(\$errorOffset)/g, '${errorOffset}')});
												    if(isc.i18nMessages.batchUploader_errorMessageDelimiterOrEndOfLine) isc.BatchUploader.addProperties({errorMessageDelimiterOrEndOfLine: (isc.i18nMessages.batchUploader_errorMessageDelimiterOrEndOfLine).replace(/(\$errorOffset)/g, '${errorOffset}')});
												    if(isc.i18nMessages.batchUploader_errorMessageInputType) isc.BatchUploader.addProperties({errorMessageInputType: isc.i18nMessages.batchUploader_errorMessageInputType});
												    if(isc.i18nMessages.batchUploader_errorMessageUndeterminedDelimiter) isc.BatchUploader.addProperties({errorMessageUndeterminedDelimiter: isc.i18nMessages.batchUploader_errorMessageUndeterminedDelimiter});
												    if(isc.i18nMessages.batchUploader_errorMessageRowsNotParsed) isc.BatchUploader.addProperties({errorMessageRowsNotParsed: (isc.i18nMessages.batchUploader_errorMessageRowsNotParsed).replace(/(\$goodRowCount)/g, '${goodRowCount}').replace(/(\$totalRows)/g, '${totalRows}').replace(/(\$firstBadRow)/g, '${firstBadRow}')});
												    if(isc.i18nMessages.batchUploader_errorMessageExcelFileDetected) isc.BatchUploader.addProperties({errorMessageExcelFileDetected: isc.i18nMessages.batchUploader_errorMessageExcelFileDetected});
												}
												if(isc.ValidatorEditor) {
												    if(isc.i18nMessages.validatorEditor_applyWhenTitle) isc.ValidatorEditor.addProperties({applyWhenTitle: isc.i18nMessages.validatorEditor_applyWhenTitle});
												    if(isc.i18nMessages.validatorEditor_applyWhenPlaceholder) isc.ValidatorEditor.addProperties({applyWhenPlaceholder: isc.i18nMessages.validatorEditor_applyWhenPlaceholder});
												    if(isc.i18nMessages.validatorEditor_validatorTitle) isc.ValidatorEditor.addProperties({validatorTitle: isc.i18nMessages.validatorEditor_validatorTitle});
												    if(isc.i18nMessages.validatorEditor_errorMessageTitle) isc.ValidatorEditor.addProperties({errorMessageTitle: isc.i18nMessages.validatorEditor_errorMessageTitle});
												    if(isc.i18nMessages.validatorEditor_errorMessageHint) isc.ValidatorEditor.addProperties({errorMessageHint: isc.i18nMessages.validatorEditor_errorMessageHint});
												    if(isc.i18nMessages.validatorEditor_defaultEditorTitle) isc.ValidatorEditor.addProperties({defaultEditorTitle: isc.i18nMessages.validatorEditor_defaultEditorTitle});
												}
												if(isc.LoginDialog) {
												    if(isc.i18nMessages.dialog_LoginTitle) isc.LoginDialog.addClassProperties({LOGIN_TITLE: isc.i18nMessages.dialog_LoginTitle});
												    if(isc.i18nMessages.dialog_UserNameTitle) isc.LoginDialog.addClassProperties({USERNAME_TITLE: isc.i18nMessages.dialog_UserNameTitle});
												    if(isc.i18nMessages.dialog_PasswordTitle) isc.LoginDialog.addClassProperties({PASSWORD_TITLE: isc.i18nMessages.dialog_PasswordTitle});
												    if(isc.i18nMessages.dialog_LoginButtonTitle) isc.LoginDialog.addClassProperties({LOGIN_BUTTON_TITLE: isc.i18nMessages.dialog_LoginButtonTitle});
												    if(isc.i18nMessages.dialog_LoginErrorMessage) isc.LoginDialog.addClassProperties({LOGIN_ERROR_MESSAGE: isc.i18nMessages.dialog_LoginErrorMessage});
												}
												if(isc.RPCManager) {
												    if(isc.i18nMessages.rpcManager_defaultPrompt) isc.RPCManager.addClassProperties({defaultPrompt: isc.i18nMessages.rpcManager_defaultPrompt});
												    if(isc.i18nMessages.rpcManager_timeoutErrorMessage) isc.RPCManager.addClassProperties({timeoutErrorMessage: isc.i18nMessages.rpcManager_timeoutErrorMessage});
												    if(isc.i18nMessages.rpcManager_removeDataPrompt) isc.RPCManager.addClassProperties({removeDataPrompt: isc.i18nMessages.rpcManager_removeDataPrompt});
												    if(isc.i18nMessages.rpcManager_saveDataPrompt) isc.RPCManager.addClassProperties({saveDataPrompt: isc.i18nMessages.rpcManager_saveDataPrompt});
												    if(isc.i18nMessages.rpcManager_validateDataPrompt) isc.RPCManager.addClassProperties({validateDataPrompt: isc.i18nMessages.rpcManager_validateDataPrompt});
												    if(isc.i18nMessages.rpcManager_fetchDataPrompt) isc.RPCManager.addClassProperties({fetchDataPrompt: isc.i18nMessages.rpcManager_fetchDataPrompt});
												}
												if(isc.Operators){
												    if(isc.i18nMessages.operators_equalsTitle) isc.Operators.addClassProperties({equalsTitle: isc.i18nMessages.operators_equalsTitle});
												    if(isc.i18nMessages.operators_notEqualTitle) isc.Operators.addClassProperties({notEqualTitle: isc.i18nMessages.operators_notEqualTitle});
												    if(isc.i18nMessages.operators_iEqualsTitle) isc.Operators.addClassProperties({iEqualsTitle: isc.i18nMessages.operators_iEqualsTitle});
												    if(isc.i18nMessages.operators_iNotEqualTitle) isc.Operators.addClassProperties({iNotEqualTitle: isc.i18nMessages.operators_iNotEqualTitle});
												    if(isc.i18nMessages.operators_greaterThanTitle) isc.Operators.addClassProperties({greaterThanTitle: isc.i18nMessages.operators_greaterThanTitle});
												    if(isc.i18nMessages.operators_lessThanTitle) isc.Operators.addClassProperties({lessThanTitle: isc.i18nMessages.operators_lessThanTitle});
												    if(isc.i18nMessages.operators_greaterOrEqualTitle) isc.Operators.addClassProperties({greaterOrEqualTitle: isc.i18nMessages.operators_greaterOrEqualTitle});
												    if(isc.i18nMessages.operators_lessOrEqualTitle) isc.Operators.addClassProperties({lessOrEqualTitle: isc.i18nMessages.operators_lessOrEqualTitle});
												    if(isc.i18nMessages.operators_betweenTitle) isc.Operators.addClassProperties({betweenTitle: isc.i18nMessages.operators_betweenTitle});
												    if(isc.i18nMessages.operators_iBetweenTitle) isc.Operators.addClassProperties({iBetweenTitle: isc.i18nMessages.operators_iBetweenTitle});
												    if(isc.i18nMessages.operators_betweenInclusiveTitle) isc.Operators.addClassProperties({betweenInclusiveTitle: isc.i18nMessages.operators_betweenInclusiveTitle});
												    if(isc.i18nMessages.operators_iBetweenInclusiveTitle) isc.Operators.addClassProperties({iBetweenInclusiveTitle: isc.i18nMessages.operators_iBetweenInclusiveTitle});
												    if(isc.i18nMessages.operators_iContainsTitle) isc.Operators.addClassProperties({iContainsTitle: isc.i18nMessages.operators_iContainsTitle});
												    if(isc.i18nMessages.operators_iStartsWithTitle) isc.Operators.addClassProperties({iStartsWithTitle: isc.i18nMessages.operators_iStartsWithTitle});
												    if(isc.i18nMessages.operators_iEndsWithTitle) isc.Operators.addClassProperties({iEndsWithTitle: isc.i18nMessages.operators_iEndsWithTitle});
												    if(isc.i18nMessages.operators_containsTitle) isc.Operators.addClassProperties({containsTitle: isc.i18nMessages.operators_containsTitle});
												    if(isc.i18nMessages.operators_startsWithTitle) isc.Operators.addClassProperties({startsWithTitle: isc.i18nMessages.operators_startsWithTitle});
												    if(isc.i18nMessages.operators_endsWithTitle) isc.Operators.addClassProperties({endsWithTitle: isc.i18nMessages.operators_endsWithTitle});
												    if(isc.i18nMessages.operators_iNotContainsTitle) isc.Operators.addClassProperties({iNotContainsTitle: isc.i18nMessages.operators_iNotContainsTitle});
												    if(isc.i18nMessages.operators_iNotStartsWithTitle) isc.Operators.addClassProperties({iNotStartsWithTitle: isc.i18nMessages.operators_iNotStartsWithTitle});
												    if(isc.i18nMessages.operators_iNotEndsWithTitle) isc.Operators.addClassProperties({iNotEndsWithTitle: isc.i18nMessages.operators_iNotEndsWithTitle});
												    if(isc.i18nMessages.operators_notContainsTitle) isc.Operators.addClassProperties({notContainsTitle: isc.i18nMessages.operators_notContainsTitle});
												    if(isc.i18nMessages.operators_notStartsWithTitle) isc.Operators.addClassProperties({notStartsWithTitle: isc.i18nMessages.operators_notStartsWithTitle});
												    if(isc.i18nMessages.operators_notEndsWithTitle) isc.Operators.addClassProperties({notEndsWithTitle: isc.i18nMessages.operators_notEndsWithTitle});
												    if(isc.i18nMessages.operators_isNullTitle) isc.Operators.addClassProperties({isNullTitle: isc.i18nMessages.operators_isNullTitle});
												    if(isc.i18nMessages.operators_notNullTitle) isc.Operators.addClassProperties({notNullTitle: isc.i18nMessages.operators_notNullTitle});
												    if(isc.i18nMessages.operators_isBlankTitle) isc.Operators.addClassProperties({isBlankTitle: isc.i18nMessages.operators_isBlankTitle});
												    if(isc.i18nMessages.operators_notBlankTitle) isc.Operators.addClassProperties({notBlankTitle: isc.i18nMessages.operators_notBlankTitle});
												    if(isc.i18nMessages.operators_regexpTitle) isc.Operators.addClassProperties({regexpTitle: isc.i18nMessages.operators_regexpTitle});
												    if(isc.i18nMessages.operators_iregexpTitle) isc.Operators.addClassProperties({iregexpTitle: isc.i18nMessages.operators_iregexpTitle});
												    if(isc.i18nMessages.operators_matchesPatternTitle) isc.Operators.addClassProperties({matchesPatternTitle: isc.i18nMessages.operators_matchesPatternTitle});
												    if(isc.i18nMessages.operators_iMatchesPatternTitle) isc.Operators.addClassProperties({iMatchesPatternTitle: isc.i18nMessages.operators_iMatchesPatternTitle});
												    if(isc.i18nMessages.operators_inSetTitle) isc.Operators.addClassProperties({inSetTitle: isc.i18nMessages.operators_inSetTitle});
												    if(isc.i18nMessages.operators_notInSetTitle) isc.Operators.addClassProperties({notInSetTitle: isc.i18nMessages.operators_notInSetTitle});
												    if(isc.i18nMessages.operators_equalsFieldTitle) isc.Operators.addClassProperties({equalsFieldTitle: isc.i18nMessages.operators_equalsFieldTitle});
												    if(isc.i18nMessages.operators_notEqualFieldTitle) isc.Operators.addClassProperties({notEqualFieldTitle: isc.i18nMessages.operators_notEqualFieldTitle});
												    if(isc.i18nMessages.operators_greaterThanFieldTitle) isc.Operators.addClassProperties({greaterThanFieldTitle: isc.i18nMessages.operators_greaterThanFieldTitle});
												    if(isc.i18nMessages.operators_lessThanFieldTitle) isc.Operators.addClassProperties({lessThanFieldTitle: isc.i18nMessages.operators_lessThanFieldTitle});
												    if(isc.i18nMessages.operators_greaterOrEqualFieldTitle) isc.Operators.addClassProperties({greaterOrEqualFieldTitle: isc.i18nMessages.operators_greaterOrEqualFieldTitle});
												    if(isc.i18nMessages.operators_lessOrEqualFieldTitle) isc.Operators.addClassProperties({lessOrEqualFieldTitle: isc.i18nMessages.operators_lessOrEqualFieldTitle});
												    if(isc.i18nMessages.operators_containsFieldTitle) isc.Operators.addClassProperties({containsFieldTitle: isc.i18nMessages.operators_containsFieldTitle});
												    if(isc.i18nMessages.operators_startsWithFieldTitle) isc.Operators.addClassProperties({startsWithFieldTitle: isc.i18nMessages.operators_startsWithFieldTitle});
												    if(isc.i18nMessages.operators_endsWithFieldTitle) isc.Operators.addClassProperties({endsWithFieldTitle: isc.i18nMessages.operators_endsWithFieldTitle});
												    if(isc.i18nMessages.operators_andTitle) isc.Operators.addClassProperties({andTitle: isc.i18nMessages.operators_andTitle});
												    if(isc.i18nMessages.operators_notTitle) isc.Operators.addClassProperties({notTitle: isc.i18nMessages.operators_notTitle});
												    if(isc.i18nMessages.operators_orTitle) isc.Operators.addClassProperties({orTitle: isc.i18nMessages.operators_orTitle});
												    if(isc.i18nMessages.operators_iEqualsFieldTitle) isc.Operators.addClassProperties({iEqualsFieldTitle: isc.i18nMessages.operators_iEqualsFieldTitle});
												    if(isc.i18nMessages.operators_iNotEqualFieldTitle) isc.Operators.addClassProperties({iNotEqualFieldTitle: isc.i18nMessages.operators_iNotEqualFieldTitle});
												    if(isc.i18nMessages.operators_iContainsFieldTitle) isc.Operators.addClassProperties({iContainsFieldTitle: isc.i18nMessages.operators_iContainsFieldTitle});
												    if(isc.i18nMessages.operators_iStartsWithFieldTitle) isc.Operators.addClassProperties({iStartsWithFieldTitle: isc.i18nMessages.operators_iStartsWithFieldTitle});
												    if(isc.i18nMessages.operators_iEndsWithFieldTitle) isc.Operators.addClassProperties({iEndsWithFieldTitle: isc.i18nMessages.operators_iEndsWithFieldTitle});
												    if(isc.i18nMessages.operators_notContainsFieldTitle) isc.Operators.addClassProperties({notContainsFieldTitle: isc.i18nMessages.operators_notContainsFieldTitle});
												    if(isc.i18nMessages.operators_notStartsWithFieldTitle) isc.Operators.addClassProperties({notStartsWithFieldTitle: isc.i18nMessages.operators_notStartsWithFieldTitle});
												    if(isc.i18nMessages.operators_notEndsWithFieldTitle) isc.Operators.addClassProperties({notEndsWithFieldTitle: isc.i18nMessages.operators_notEndsWithFieldTitle});
												    if(isc.i18nMessages.operators_iNotContainsFieldTitle) isc.Operators.addClassProperties({iNotContainsFieldTitle: isc.i18nMessages.operators_iNotContainsFieldTitle});
												    if(isc.i18nMessages.operators_iNotStartsWithFieldTitle) isc.Operators.addClassProperties({iNotStartsWithFieldTitle: isc.i18nMessages.operators_iNotStartsWithFieldTitle});
												    if(isc.i18nMessages.operators_iNotEndsWithFieldTitle) isc.Operators.addClassProperties({iNotEndsWithFieldTitle: isc.i18nMessages.operators_iNotEndsWithFieldTitle});
												    if(isc.i18nMessages.operators_containsPatternTitle) isc.Operators.addClassProperties({containsPatternTitle: isc.i18nMessages.operators_containsPatternTitle});
												    if(isc.i18nMessages.operators_iContainsPatternTitle) isc.Operators.addClassProperties({iContainsPatternTitle: isc.i18nMessages.operators_iContainsPatternTitle});
												    if(isc.i18nMessages.operators_startsWithPatternTitle) isc.Operators.addClassProperties({startsWithPatternTitle: isc.i18nMessages.operators_startsWithPatternTitle});
												    if(isc.i18nMessages.operators_iStartsWithPatternTitle) isc.Operators.addClassProperties({iStartsWithPatternTitle: isc.i18nMessages.operators_iStartsWithPatternTitle});
												    if(isc.i18nMessages.operators_endsWithPatternTitle) isc.Operators.addClassProperties({endsWithPatternTitle: isc.i18nMessages.operators_endsWithPatternTitle});
												    if(isc.i18nMessages.operators_iEndsWithPatternTitle) isc.Operators.addClassProperties({iEndsWithPatternTitle: isc.i18nMessages.operators_iEndsWithPatternTitle});
												}
												if(isc.GroupingMessages) {
												    if(isc.i18nMessages.grouping_upcomingBeforeTitle) isc.GroupingMessages.addClassProperties({upcomingBeforeTitle: isc.i18nMessages.grouping_upcomingBeforeTitle});
												    if(isc.i18nMessages.grouping_upcomingTodayTitle) isc.GroupingMessages.addClassProperties({upcomingTodayTitle: isc.i18nMessages.grouping_upcomingTodayTitle});
												    if(isc.i18nMessages.grouping_upcomingTomorrowTitle) isc.GroupingMessages.addClassProperties({upcomingTomorrowTitle: isc.i18nMessages.grouping_upcomingTomorrowTitle});
												    if(isc.i18nMessages.grouping_upcomingThisWeekTitle) isc.GroupingMessages.addClassProperties({upcomingThisWeekTitle: isc.i18nMessages.grouping_upcomingThisWeekTitle});
												    if(isc.i18nMessages.grouping_upcomingNextWeekTitle) isc.GroupingMessages.addClassProperties({upcomingNextWeekTitle: isc.i18nMessages.grouping_upcomingNextWeekTitle});
												    if(isc.i18nMessages.grouping_upcomingThisMonthTitle) isc.GroupingMessages.addClassProperties({upcomingThisMonthTitle: isc.i18nMessages.grouping_upcomingThisMonthTitle});
												    if(isc.i18nMessages.grouping_upcomingNextMonthTitle) isc.GroupingMessages.addClassProperties({upcomingNextMonthTitle: isc.i18nMessages.grouping_upcomingNextMonthTitle});
												    if(isc.i18nMessages.grouping_upcomingThisYearTitle) isc.GroupingMessages.addClassProperties({upcomingThisYearTitle: isc.i18nMessages.grouping_upcomingThisYearTitle});
												    if(isc.i18nMessages.grouping_upcomingNextYearTitle) isc.GroupingMessages.addClassProperties({upcomingNextYearTitle: isc.i18nMessages.grouping_upcomingNextYearTitle});
												    if(isc.i18nMessages.grouping_upcomingLaterTitle) isc.GroupingMessages.addClassProperties({upcomingLaterTitle: isc.i18nMessages.grouping_upcomingLaterTitle});
												    if(isc.i18nMessages.grouping_byDayTitle) isc.GroupingMessages.addClassProperties({byDayTitle: isc.i18nMessages.grouping_byDayTitle});
												    if(isc.i18nMessages.grouping_byWeekTitle) isc.GroupingMessages.addClassProperties({byWeekTitle: isc.i18nMessages.grouping_byWeekTitle});
												    if(isc.i18nMessages.grouping_byMonthTitle) isc.GroupingMessages.addClassProperties({byMonthTitle: isc.i18nMessages.grouping_byMonthTitle});
												    if(isc.i18nMessages.grouping_byQuarterTitle) isc.GroupingMessages.addClassProperties({byQuarterTitle: isc.i18nMessages.grouping_byQuarterTitle});
												    if(isc.i18nMessages.grouping_byYearTitle) isc.GroupingMessages.addClassProperties({byYearTitle: isc.i18nMessages.grouping_byYearTitle});
												    if(isc.i18nMessages.grouping_byDayOfMonthTitle) isc.GroupingMessages.addClassProperties({byDayOfMonthTitle: isc.i18nMessages.grouping_byDayOfMonthTitle});
												    if(isc.i18nMessages.grouping_byDateTitle) isc.GroupingMessages.addClassProperties({byDateTitle: isc.i18nMessages.grouping_byDateTitle});
												    if(isc.i18nMessages.grouping_byWeekAndYearTitle) isc.GroupingMessages.addClassProperties({byWeekAndYearTitle: isc.i18nMessages.grouping_byWeekAndYearTitle});
												    if(isc.i18nMessages.grouping_byMonthAndYearTitle) isc.GroupingMessages.addClassProperties({byMonthAndYearTitle: isc.i18nMessages.grouping_byMonthAndYearTitle});
												    if(isc.i18nMessages.grouping_byQuarterAndYearTitle) isc.GroupingMessages.addClassProperties({byQuarterAndYearTitle: isc.i18nMessages.grouping_byQuarterAndYearTitle});
												    if(isc.i18nMessages.grouping_byDayOfWeekAndYearTitle) isc.GroupingMessages.addClassProperties({byDayOfWeekAndYearTitle: isc.i18nMessages.grouping_byDayOfWeekAndYearTitle});
												    if(isc.i18nMessages.grouping_byDayOfMonthAndYearTitle) isc.GroupingMessages.addClassProperties({byDayOfMonthAndYearTitle: isc.i18nMessages.grouping_byDayOfMonthAndYearTitle});
												    if(isc.i18nMessages.grouping_byUpcomingTitle) isc.GroupingMessages.addClassProperties({byUpcomingTitle: isc.i18nMessages.grouping_byUpcomingTitle});
												    if(isc.i18nMessages.grouping_byHoursTitle) isc.GroupingMessages.addClassProperties({byHoursTitle: isc.i18nMessages.grouping_byHoursTitle});
												    if(isc.i18nMessages.grouping_byMinutesTitle) isc.GroupingMessages.addClassProperties({byMinutesTitle: isc.i18nMessages.grouping_byMinutesTitle});
												    if(isc.i18nMessages.grouping_bySecondsTitle) isc.GroupingMessages.addClassProperties({bySecondsTitle: isc.i18nMessages.grouping_bySecondsTitle});
												    if(isc.i18nMessages.grouping_byMillisecondsTitle) isc.GroupingMessages.addClassProperties({byMillisecondsTitle: isc.i18nMessages.grouping_byMillisecondsTitle});
												    if(isc.i18nMessages.grouping_weekNumberTitle) isc.GroupingMessages.addClassProperties({weekNumberTitle: isc.i18nMessages.grouping_weekNumberTitle});
												    if(isc.i18nMessages.grouping_timezoneMinutesSuffix) isc.GroupingMessages.addClassProperties({timezoneMinutesSuffix: isc.i18nMessages.grouping_timezoneMinutesSuffix});
												    if(isc.i18nMessages.grouping_timezoneSecondsSuffix) isc.GroupingMessages.addClassProperties({timezoneSecondsSuffix: isc.i18nMessages.grouping_timezoneSecondsSuffix});
												}
												if(isc.Validator) {
												    if(isc.i18nMessages.validator_notABoolean) isc.Validator.addClassProperties({notABoolean: isc.i18nMessages.validator_notABoolean});
												    if(isc.i18nMessages.validator_notAString) isc.Validator.addClassProperties({notAString: isc.i18nMessages.validator_notAString});
												    if(isc.i18nMessages.validator_notAnInteger) isc.Validator.addClassProperties({notAnInteger: isc.i18nMessages.validator_notAnInteger});
												    if(isc.i18nMessages.validator_notADecimal) isc.Validator.addClassProperties({notADecimal: isc.i18nMessages.validator_notADecimal});
												    if(isc.i18nMessages.validator_notADate) isc.Validator.addClassProperties({notADate: isc.i18nMessages.validator_notADate});
												    if(isc.i18nMessages.validator_notATime) isc.Validator.addClassProperties({notATime: isc.i18nMessages.validator_notATime});
												    if(isc.i18nMessages.validator_notAnIdentifier) isc.Validator.addClassProperties({notAnIdentifier: isc.i18nMessages.validator_notAnIdentifier});
												    if(isc.i18nMessages.validator_notARegex) isc.Validator.addClassProperties({notARegex: isc.i18nMessages.validator_notARegex});
												    if(isc.i18nMessages.validator_notAColor) isc.Validator.addClassProperties({notAColor: isc.i18nMessages.validator_notAColor});
												    if(isc.i18nMessages.validator_mustBeLessThan) isc.Validator.addClassProperties({mustBeLessThan: (isc.i18nMessages.validator_mustBeLessThan).replace(/(\$max)/g, '${max}')});
												    if(isc.i18nMessages.validator_mustBeGreaterThan) isc.Validator.addClassProperties({mustBeGreaterThan: (isc.i18nMessages.validator_mustBeGreaterThan).replace(/(\$min)/g, '${min}')});
												    if(isc.i18nMessages.validator_mustBeLaterThan) isc.Validator.addClassProperties({mustBeLaterThan: (isc.i18nMessages.validator_mustBeLaterThan).replace(/(\$min)/g, '${min.toShortDate()}')});
												    if(isc.i18nMessages.validator_mustBeEarlierThan) isc.Validator.addClassProperties({mustBeEarlierThan: (isc.i18nMessages.validator_mustBeEarlierThan).replace(/(\$max)/g, '${max.toShortDate()}')});
												    if(isc.i18nMessages.validator_mustBeShorterThan) isc.Validator.addClassProperties({mustBeShorterThan: (isc.i18nMessages.validator_mustBeShorterThan).replace(/(\$max)/g, '${max}')});
												    if(isc.i18nMessages.validator_mustBeLongerThan) isc.Validator.addClassProperties({mustBeLongerThan: (isc.i18nMessages.validator_mustBeLongerThan).replace(/(\$min)/g, '${min}')});
												    if(isc.i18nMessages.validator_mustBeExactLength) isc.Validator.addClassProperties({mustBeExactLength: (isc.i18nMessages.validator_mustBeExactLength).replace(/(\$max)/g, '${max}')});
												    if(isc.i18nMessages.validator_requiredField) isc.Validator.addClassProperties({requiredField: isc.i18nMessages.validator_requiredField});
												    if(isc.i18nMessages.validator_requiredFile) isc.Validator.addClassProperties({requiredFile: isc.i18nMessages.validator_requiredFile});
												    if(isc.i18nMessages.validator_notOneOf) isc.Validator.addClassProperties({notOneOf: isc.i18nMessages.validator_notOneOf});
												    if(isc.i18nMessages.validator_notAFunction) isc.Validator.addClassProperties({notAFunction: isc.i18nMessages.validator_notAFunction});
												    if(isc.i18nMessages.validator_mustBeLaterThanTime) isc.Validator.addClassProperties({mustBeLaterThanTime: (isc.i18nMessages.validator_mustBeLaterThanTime).replace(/(\$min)/g, '${isc.Time.toShortTime(min)}')});
												    if(isc.i18nMessages.validator_mustBeEarlierThanTime) isc.Validator.addClassProperties({mustBeEarlierThanTime: (isc.i18nMessages.validator_mustBeEarlierThanTime).replace(/(\$max)/g, '${isc.Time.toShortTime(max)}')});
												    if(isc.i18nMessages.validator_maxFileSizeExceeded) isc.Validator.addClassProperties({maxFileSizeExceeded: (isc.i18nMessages.validator_maxFileSizeExceeded).replace(/(\$uploadedFileSize)/g, '${isc.NumberUtil.toMiBString(uploadedFileSize, maxFileSize)} MiB').replace(/(\$maxFileSize)/g, '${isc.NumberUtil.toMiBString(maxFileSize, uploadedFileSize)} MiB').replace(/(\$uploadedFileName)/g, '${uploadedFileName}')});
												}
												if(isc.Time) {
												    if(isc.i18nMessages.time_AMIndicator) isc.Time.addClassProperties({AMIndicator: isc.i18nMessages.time_AMIndicator});
												    if(isc.i18nMessages.time_PMIndicator) isc.Time.addClassProperties({PMIndicator: isc.i18nMessages.time_PMIndicator});
												}
												if(isc.Window) {
												    if(isc.i18nMessages.window_title) isc.Window.addProperties({title: isc.i18nMessages.window_title});
												}
												if(isc.DateChooser) {
												    if(isc.i18nMessages.dateChooser_todayButtonTitle) isc.DateChooser.addProperties({todayButtonTitle: isc.i18nMessages.dateChooser_todayButtonTitle});
												    if(isc.i18nMessages.dateChooser_cancelButtonTitle) isc.DateChooser.addProperties({cancelButtonTitle: isc.i18nMessages.dateChooser_cancelButtonTitle});
												    if(isc.i18nMessages.dateChooser_applyButtonTitle) isc.DateChooser.addProperties({applyButtonTitle: isc.i18nMessages.dateChooser_applyButtonTitle});
												    if(isc.i18nMessages.dateChooser_firstDayOfWeek) isc.DateChooser.addProperties({firstDayOfWeek: Number(isc.i18nMessages.dateChooser_firstDayOfWeek)});
												    if(isc.i18nMessages.dateChooser_fiscalYearFieldTitle) isc.DateChooser.addProperties({fiscalYearFieldTitle: isc.i18nMessages.dateChooser_fiscalYearFieldTitle});
												    if(isc.i18nMessages.dateChooser_weekFieldTitle) isc.DateChooser.addProperties({weekFieldTitle: isc.i18nMessages.dateChooser_weekFieldTitle});
												    if(isc.i18nMessages.dateChooser_timeItemTitle) isc.DateChooser.addProperties({timeItemTitle: isc.i18nMessages.dateChooser_timeItemTitle});
												}
												if(isc.DynamicForm) {
												    if(isc.i18nMessages.dynamicForm_errorsPreamble) isc.DynamicForm.addProperties({errorsPreamble: isc.i18nMessages.dynamicForm_errorsPreamble});
												    if(isc.i18nMessages.dynamicForm_formSubmitFailedWarning) isc.DynamicForm.addProperties({formSubmitFailedWarning: isc.i18nMessages.dynamicForm_formSubmitFailedWarning});
												    if(isc.i18nMessages.dynamicForm_originalValueMessage) isc.DynamicForm.addProperties({originalValueMessage: isc.i18nMessages.dynamicForm_originalValueMessage});
												}
												if(isc.FormItem) {
												    if(isc.i18nMessages.formItem_loadingDisplayValue) isc.FormItem.addProperties({loadingDisplayValue: isc.i18nMessages.formItem_loadingDisplayValue});
												}
												if(isc.SelectItem) {
												    if(isc.i18nMessages.selectOtherItem_otherTitle) isc.SelectItem.addProperties({otherTitle: isc.i18nMessages.selectOtherItem_otherTitle});
												    if(isc.i18nMessages.selectOtherItem_selectOtherPrompt) isc.SelectItem.addProperties({selectOtherPrompt: isc.i18nMessages.selectOtherItem_selectOtherPrompt + ' ${item.getTitle()} :'});
												}
												if(isc.CheckboxItem) {
												    if(isc.i18nMessages.checkboxItem_checkedDescription) isc.CheckboxItem.addProperties({checkedDescription: isc.i18nMessages.checkboxItem_checkedDescription});
												    if(isc.i18nMessages.checkboxItem_uncheckedDescription) isc.CheckboxItem.addProperties({uncheckedDescription: isc.i18nMessages.checkboxItem_uncheckedDescription});
												    if(isc.i18nMessages.checkboxItem_partialSelectedDescription) isc.CheckboxItem.addProperties({partialSelectedDescription: isc.i18nMessages.checkboxItem_partialSelectedDescription});
												    if(isc.i18nMessages.checkboxItem_unsetDescription) isc.CheckboxItem.addProperties({unsetDescription: isc.i18nMessages.checkboxItem_unsetDescription});
												}
												if(isc.DateItem) {
												    if(isc.i18nMessages.dateItem_invalidDateStringMessage) isc.DateItem.addProperties({invalidDateStringMessage: isc.i18nMessages.dateItem_invalidDateStringMessage});
												    if(isc.i18nMessages.dateItem_pickerIconPrompt) isc.DateItem.addProperties({pickerIconPrompt: isc.i18nMessages.dateItem_pickerIconPrompt});
												    if(isc.i18nMessages.dateItem_daySelectorPrompt) isc.DateItem.changeDefaults("daySelectorDefaults", {prompt: isc.i18nMessages.dateItem_daySelectorPrompt});
												    if(isc.i18nMessages.dateItem_monthSelectorPrompt) isc.DateItem.changeDefaults("monthSelectorDefaults", {prompt: isc.i18nMessages.dateItem_monthSelectorPrompt});
												    if(isc.i18nMessages.dateItem_yearSelectorPrompt) isc.DateItem.changeDefaults("yearSelectorDefaults", {prompt: isc.i18nMessages.dateItem_yearSelectorPrompt});
												var selectorFormat = isc.i18nMessages.dateItem_selectorFormat;
												if(selectorFormat != null && selectorFormat != 'null') isc.DateItem.addProperties({selectorFormat: selectorFormat});
												}
												if(isc.TimeItem) {
												    if(isc.i18nMessages.timeItem_hourItemTitle) isc.TimeItem.addProperties({hourItemTitle: isc.i18nMessages.timeItem_hourItemTitle});
												    if(isc.i18nMessages.timeItem_hourItemPrompt) isc.TimeItem.addProperties({hourItemPrompt: isc.i18nMessages.timeItem_hourItemPrompt});
												    if(isc.i18nMessages.timeItem_minuteItemTitle) isc.TimeItem.addProperties({minuteItemTitle: isc.i18nMessages.timeItem_minuteItemTitle});
												    if(isc.i18nMessages.timeItem_minuteItemPrompt) isc.TimeItem.addProperties({minuteItemPrompt: isc.i18nMessages.timeItem_minuteItemPrompt});
												    if(isc.i18nMessages.timeItem_secondItemTitle) isc.TimeItem.addProperties({secondItemTitle: isc.i18nMessages.timeItem_secondItemTitle});
												    if(isc.i18nMessages.timeItem_secondItemPrompt) isc.TimeItem.addProperties({secondItemPrompt: isc.i18nMessages.timeItem_secondItemPrompt});
												    if(isc.i18nMessages.timeItem_millisecondItemTitle) isc.TimeItem.addProperties({millisecondItemTitle: isc.i18nMessages.timeItem_millisecondItemTitle});
												    if(isc.i18nMessages.timeItem_millisecondItemPrompt) isc.TimeItem.addProperties({millisecondItemPrompt: isc.i18nMessages.timeItem_millisecondItemPrompt});
												    if(isc.i18nMessages.timeItem_ampmItemTitle) isc.TimeItem.addProperties({ampmItemTitle: isc.i18nMessages.timeItem_ampmItemTitle});
												    if(isc.i18nMessages.timeItem_ampmItemPrompt) isc.TimeItem.addProperties({ampmItemPrompt: isc.i18nMessages.timeItem_ampmItemPrompt});
												    if(isc.i18nMessages.timeItem_invalidTimeStringMessage) isc.TimeItem.addProperties({invalidTimeStringMessage: isc.i18nMessages.timeItem_invalidTimeStringMessage});
												}
												if(isc.ColorItem) {
												    if(isc.i18nMessages.colorItem_pickerIconPrompt) isc.ColorItem.addProperties({pickerIconPrompt: isc.i18nMessages.colorItem_pickerIconPrompt});
												}
												if(isc.ColorPicker) {
												    if(isc.i18nMessages.colorPicker_basicColorLabel) isc.ColorPicker.addProperties({basicColorLabel: isc.i18nMessages.colorPicker_basicColorLabel});
												    if(isc.i18nMessages.colorPicker_blueFieldPrompt) isc.ColorPicker.addProperties({blueFieldPrompt: isc.i18nMessages.colorPicker_blueFieldPrompt});
												    if(isc.i18nMessages.colorPicker_blueFieldTitle) isc.ColorPicker.addProperties({blueFieldTitle: isc.i18nMessages.colorPicker_blueFieldTitle});
												    if(isc.i18nMessages.colorPicker_cancelButtonTitle) isc.ColorPicker.addProperties({cancelButtonTitle: isc.i18nMessages.colorPicker_cancelButtonTitle});
												    if(isc.i18nMessages.colorPicker_greenFieldPrompt) isc.ColorPicker.addProperties({greenFieldPrompt: isc.i18nMessages.colorPicker_greenFieldPrompt});
												    if(isc.i18nMessages.colorPicker_greenFieldTitle) isc.ColorPicker.addProperties({greenFieldTitle: isc.i18nMessages.colorPicker_greenFieldTitle});
												    if(isc.i18nMessages.colorPicker_htmlFieldPrompt) isc.ColorPicker.addProperties({htmlFieldPrompt: isc.i18nMessages.colorPicker_htmlFieldPrompt});
												    if(isc.i18nMessages.colorPicker_htmlFieldTitle) isc.ColorPicker.addProperties({htmlFieldTitle: isc.i18nMessages.colorPicker_htmlFieldTitle});
												    if(isc.i18nMessages.colorPicker_hueFieldPrompt) isc.ColorPicker.addProperties({hueFieldPrompt: isc.i18nMessages.colorPicker_hueFieldPrompt});
												    if(isc.i18nMessages.colorPicker_hueFieldTitle) isc.ColorPicker.addProperties({hueFieldTitle: isc.i18nMessages.colorPicker_hueFieldTitle});
												    if(isc.i18nMessages.colorPicker_lessButtonTitle) isc.ColorPicker.addProperties({lessButtonTitle: isc.i18nMessages.colorPicker_lessButtonTitle});
												    if(isc.i18nMessages.colorPicker_lumFieldPrompt) isc.ColorPicker.addProperties({lumFieldPrompt: isc.i18nMessages.colorPicker_lumFieldPrompt});
												    if(isc.i18nMessages.colorPicker_lumFieldTitle) isc.ColorPicker.addProperties({lumFieldTitle: isc.i18nMessages.colorPicker_lumFieldTitle});
												    if(isc.i18nMessages.colorPicker_moreButtonTitle) isc.ColorPicker.addProperties({moreButtonTitle: isc.i18nMessages.colorPicker_moreButtonTitle});
												    if(isc.i18nMessages.colorPicker_okButtonTitle) isc.ColorPicker.addProperties({okButtonTitle: isc.i18nMessages.colorPicker_okButtonTitle});
												    if(isc.i18nMessages.colorPicker_opacitySliderLabel) isc.ColorPicker.addProperties({opacitySliderLabel: isc.i18nMessages.colorPicker_opacitySliderLabel});
												    if(isc.i18nMessages.colorPicker_redFieldPrompt) isc.ColorPicker.addProperties({redFieldPrompt: isc.i18nMessages.colorPicker_redFieldPrompt});
												    if(isc.i18nMessages.colorPicker_redFieldTitle) isc.ColorPicker.addProperties({redFieldTitle: isc.i18nMessages.colorPicker_redFieldTitle});
												    if(isc.i18nMessages.colorPicker_satFieldPrompt) isc.ColorPicker.addProperties({satFieldPrompt: isc.i18nMessages.colorPicker_satFieldPrompt});
												    if(isc.i18nMessages.colorPicker_satFieldTitle) isc.ColorPicker.addProperties({satFieldTitle: isc.i18nMessages.colorPicker_satFieldTitle});
												    if(isc.i18nMessages.colorPicker_selectTitle) isc.ColorPicker.addProperties({selectTitle: isc.i18nMessages.colorPicker_selectTitle});
												    if(isc.i18nMessages.colorPicker_selectedColorLabel) isc.ColorPicker.addProperties({selectedColorLabel: isc.i18nMessages.colorPicker_selectedColorLabel});
												}
												if(isc.MultiComboBoxItem) {
												    if(isc.i18nMessages.multiComboBoxItem_defaultHint) isc.MultiComboBoxItem.addClassProperties({defaultHint: isc.i18nMessages.multiComboBoxItem_defaultHint});
												}
												if(isc.MultiFilePicker) {
												    if(isc.i18nMessages.multiFilePicker_emptyMessage) isc.MultiFilePicker.addProperties({emptyMessage: isc.i18nMessages.multiFilePicker_emptyMessage});
												    if(isc.i18nMessages.multiFilePicker_title) isc.MultiFilePicker.addProperties({title: isc.i18nMessages.multiFilePicker_title});
												}
												if(isc.RichTextEditor) {
												    if(isc.i18nMessages.richTextEditor_boldSelectionPrompt) isc.RichTextEditor.addProperties({boldSelectionPrompt:isc.i18nMessages.richTextEditor_boldSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_italicSelectionPrompt) isc.RichTextEditor.addProperties({italicSelectionPrompt:isc.i18nMessages.richTextEditor_italicSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_underlineSelectionPrompt) isc.RichTextEditor.addProperties({underlineSelectionPrompt:isc.i18nMessages.richTextEditor_underlineSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_copySelectionPrompt) isc.RichTextEditor.addProperties({copySelectionPrompt:isc.i18nMessages.richTextEditor_copySelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_cutSelectionPrompt) isc.RichTextEditor.addProperties({cutSelectionPrompt:isc.i18nMessages.richTextEditor_cutSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_pasteSelectionPrompt) isc.RichTextEditor.addProperties({pasteSelectionPrompt:isc.i18nMessages.richTextEditor_pasteSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_alignLeftPrompt) isc.RichTextEditor.addProperties({alignLeftPrompt:isc.i18nMessages.richTextEditor_alignLeftPrompt});
												    if(isc.i18nMessages.richTextEditor_alignRightPrompt) isc.RichTextEditor.addProperties({alignRightPrompt:isc.i18nMessages.richTextEditor_alignRightPrompt});
												    if(isc.i18nMessages.richTextEditor_alignCenterPrompt) isc.RichTextEditor.addProperties({alignCenterPrompt:isc.i18nMessages.richTextEditor_alignCenterPrompt});
												    if(isc.i18nMessages.richTextEditor_justifyPrompt) isc.RichTextEditor.addProperties({justifyPrompt:isc.i18nMessages.richTextEditor_justifyPrompt});
												    if(isc.i18nMessages.richTextEditor_indentPrompt) isc.RichTextEditor.addProperties({indentPrompt:isc.i18nMessages.richTextEditor_indentPrompt});
												    if(isc.i18nMessages.richTextEditor_outdentPrompt) isc.RichTextEditor.addProperties({outdentPrompt:isc.i18nMessages.richTextEditor_outdentPrompt});
												    if(isc.i18nMessages.richTextEditor_colorPrompt) isc.RichTextEditor.addProperties({colorPrompt:isc.i18nMessages.richTextEditor_colorPrompt});
												    if(isc.i18nMessages.richTextEditor_backgroundColorPrompt) isc.RichTextEditor.addProperties({backgroundColorPrompt:isc.i18nMessages.richTextEditor_backgroundColorPrompt});
												    if(isc.i18nMessages.richTextEditor_linkPrompt) isc.RichTextEditor.addProperties({linkPrompt:isc.i18nMessages.richTextEditor_linkPrompt});
												    if(isc.i18nMessages.richTextEditor_fontSelectorPrompt) isc.RichTextEditor.addProperties({fontSelectorPrompt:isc.i18nMessages.richTextEditor_fontSelectorPrompt});
												    if(isc.i18nMessages.richTextEditor_fontSizeSelectorPrompt) isc.RichTextEditor.addProperties({fontSizeSelectorPrompt:isc.i18nMessages.richTextEditor_fontSizeSelectorPrompt});
												    if(isc.i18nMessages.richTextEditor_linkUrlTitle) isc.RichTextEditor.addProperties({linkUrlTitle:isc.i18nMessages.richTextEditor_linkUrlTitle});
												    if(isc.i18nMessages.richTextEditor_strikethroughSelectionPrompt) isc.RichTextEditor.addProperties({strikethroughSelectionPrompt:isc.i18nMessages.richTextEditor_strikethroughSelectionPrompt});
												    if(isc.i18nMessages.richTextEditor_orderedListPrompt) isc.RichTextEditor.addProperties({orderedListPrompt:isc.i18nMessages.richTextEditor_orderedListPrompt});
												    if(isc.i18nMessages.richTextEditor_unorderedListPrompt) isc.RichTextEditor.addProperties({unorderedListPrompt:isc.i18nMessages.richTextEditor_unorderedListPrompt});
												    if(isc.i18nMessages.richTextEditor_listPropertiesPrompt) isc.RichTextEditor.addProperties({listPropertiesPrompt:isc.i18nMessages.richTextEditor_listPropertiesPrompt});
												    if(isc.i18nMessages.richTextEditor_listPropertiesWarningText) isc.RichTextEditor.addProperties({listPropertiesWarningText:isc.i18nMessages.richTextEditor_listPropertiesWarningText});
												}
												if(isc.Selection) {
												    if(isc.i18nMessages.selection_selectionRangeNotLoadedMessage) isc.Selection.addProperties({selectionRangeNotLoadedMessage: isc.i18nMessages.selection_selectionRangeNotLoadedMessage});
												}
												if(isc.ListPropertiesDialog) {
												    if(isc.i18nMessages.listPropertiesDialog_title) isc.ListPropertiesDialog.addProperties({title: isc.i18nMessages.listPropertiesDialog_title});
												    if(isc.i18nMessages.listPropertiesDialog_applyButtonTitle) isc.ListPropertiesDialog.addProperties({applyButtonTitle: isc.i18nMessages.listPropertiesDialog_applyButtonTitle});
												    if(isc.i18nMessages.listPropertiesDialog_cancelButtonTitle) isc.ListPropertiesDialog.addProperties({cancelButtonTitle: isc.i18nMessages.listPropertiesDialog_cancelButtonTitle});
												}
												if(isc.ListPropertiesPane) {
												    if(isc.i18nMessages.listPropertiesPane_startNumberFieldTitle) isc.ListPropertiesPane.addProperties({startNumberFieldTitle: isc.i18nMessages.listPropertiesPane_startNumberFieldTitle});
												}
												if(isc.ListGrid) {
												    if(isc.i18nMessages.listGrid_emptyMessage) isc.ListGrid.addProperties({emptyMessage: isc.i18nMessages.listGrid_emptyMessage});
												    if(isc.i18nMessages.listGrid_loadingDataMessage) isc.ListGrid.addProperties({loadingDataMessage: '${loadingImage}&nbsp;' + isc.i18nMessages.listGrid_loadingDataMessage});
												    if(isc.i18nMessages.listGrid_removeFieldTitle) isc.ListGrid.addProperties({removeFieldTitle: isc.i18nMessages.listGrid_removeFieldTitle});
												    if(isc.i18nMessages.listGrid_cancelEditingConfirmationMessage) isc.ListGrid.addProperties({cancelEditingConfirmationMessage: isc.i18nMessages.listGrid_cancelEditingConfirmationMessage});
												    if(isc.i18nMessages.listGrid_confirmDiscardEditsMessage) isc.ListGrid.addProperties({confirmDiscardEditsMessage: isc.i18nMessages.listGrid_confirmDiscardEditsMessage});
												    if(isc.i18nMessages.listGrid_discardEditsSaveButtonTitle) isc.ListGrid.addProperties({discardEditsSaveButtonTitle: isc.i18nMessages.listGrid_discardEditsSaveButtonTitle});
												    if(isc.i18nMessages.listGrid_newRecordRowMessage) isc.ListGrid.addProperties({newRecordRowMessage: isc.i18nMessages.listGrid_newRecordRowMessage});
												    if(isc.i18nMessages.listGrid_openRecordEditorContextMenuItemTitle) isc.ListGrid.addProperties({openRecordEditorContextMenuItemTitle: isc.i18nMessages.listGrid_openRecordEditorContextMenuItemTitle});
												    if(isc.i18nMessages.listGrid_dismissEmbeddedComponentContextMenuItemTitle) isc.ListGrid.addProperties({dismissEmbeddedComponentContextMenuItemTitle: isc.i18nMessages.listGrid_dismissEmbeddedComponentContextMenuItemTitle});
												    if(isc.i18nMessages.listGrid_deleteRecordContextMenuItemTitle) isc.ListGrid.addProperties({deleteRecordContextMenuItemTitle: isc.i18nMessages.listGrid_deleteRecordContextMenuItemTitle});
												    if(isc.i18nMessages.listGrid_recordEditorSaveButtonTitle) isc.ListGrid.addProperties({recordEditorSaveButtonTitle: isc.i18nMessages.listGrid_recordEditorSaveButtonTitle});
												    if(isc.i18nMessages.listGrid_recordEditorCancelButtonTitle) isc.ListGrid.addProperties({recordEditorCancelButtonTitle: isc.i18nMessages.listGrid_recordEditorCancelButtonTitle});
												    if(isc.i18nMessages.listGrid_maxExpandedRecordsPrompt) isc.ListGrid.addProperties({maxExpandedRecordsPrompt: (isc.i18nMessages.listGrid_maxExpandedRecordsPrompt).replace(/(\$count)/g, '${count}')});
												    if(isc.i18nMessages.listGrid_freezeOnRightText) isc.ListGrid.addProperties({freezeOnRightText: isc.i18nMessages.listGrid_freezeOnRightText});
												    if(isc.i18nMessages.listGrid_freezeOnLeftText) isc.ListGrid.addProperties({freezeOnLeftText: isc.i18nMessages.listGrid_freezeOnLeftText});
												    if(isc.i18nMessages.listGrid_sortFieldAscendingText) isc.ListGrid.addProperties({sortFieldAscendingText: isc.i18nMessages.listGrid_sortFieldAscendingText});
												    if(isc.i18nMessages.listGrid_sortFieldDescendingText) isc.ListGrid.addProperties({sortFieldDescendingText: isc.i18nMessages.listGrid_sortFieldDescendingText});
												    if(isc.i18nMessages.listGrid_clearSortFieldText) isc.ListGrid.addProperties({clearSortFieldText: isc.i18nMessages.listGrid_clearSortFieldText});
												    if(isc.i18nMessages.listGrid_clearAllSortingText) isc.ListGrid.addProperties({clearAllSortingText: isc.i18nMessages.listGrid_clearAllSortingText});
												    if(isc.i18nMessages.listGrid_clearFilterText) isc.ListGrid.addProperties({clearFilterText: isc.i18nMessages.listGrid_clearFilterText});
												    if(isc.i18nMessages.listGrid_filterUsingText) isc.ListGrid.addProperties({filterUsingText: isc.i18nMessages.listGrid_filterUsingText});
												    if(isc.i18nMessages.listGrid_defaultFilterOperatorSuffix) isc.ListGrid.addProperties({defaultFilterOperatorSuffix: isc.i18nMessages.listGrid_defaultFilterOperatorSuffix});
												    if(isc.i18nMessages.listGrid_configureSortText) isc.ListGrid.addProperties({configureSortText: isc.i18nMessages.listGrid_configureSortText});
												    if(isc.i18nMessages.listGrid_configureGroupingText) isc.ListGrid.addProperties({configureGroupingText: isc.i18nMessages.listGrid_configureGroupingText});
												    if(isc.i18nMessages.listGrid_autoFitFieldText) isc.ListGrid.addProperties({autoFitFieldText: isc.i18nMessages.listGrid_autoFitFieldText});
												    if(isc.i18nMessages.listGrid_autoFitAllText) isc.ListGrid.addProperties({autoFitAllText: isc.i18nMessages.listGrid_autoFitAllText});
												    if(isc.i18nMessages.listGrid_fieldVisibilitySubmenuTitle) isc.ListGrid.addProperties({fieldVisibilitySubmenuTitle: isc.i18nMessages.listGrid_fieldVisibilitySubmenuTitle});
												    if(isc.i18nMessages.listGrid_freezeFieldText) isc.ListGrid.addProperties({freezeFieldText: (isc.i18nMessages.listGrid_freezeFieldText).replace(/(\$title)/g, '${title}')});
												    if(isc.i18nMessages.listGrid_unfreezeFieldText) isc.ListGrid.addProperties({unfreezeFieldText: (isc.i18nMessages.listGrid_unfreezeFieldText).replace(/(\$title)/g, '${title}')});
												    if(isc.i18nMessages.listGrid_groupByText) isc.ListGrid.addProperties({groupByText: (isc.i18nMessages.listGrid_groupByText).replace(/(\$title)/g, '${title}')});
												    if(isc.i18nMessages.listGrid_ungroupText) isc.ListGrid.addProperties({ungroupText: isc.i18nMessages.listGrid_ungroupText});
												    if(isc.i18nMessages.listGrid_asynchGroupingPrompt) isc.ListGrid.addProperties({asynchGroupingPrompt: '${loadingImage}&nbsp;' + isc.i18nMessages.listGrid_asynchGroupingPrompt});
												    if(isc.i18nMessages.listGrid_hiliteReplaceValueFieldTitle) isc.ListGrid.addProperties({hiliteReplaceValueFieldTitle: isc.i18nMessages.listGrid_hiliteReplaceValueFieldTitle});
												    if(isc.i18nMessages.listGrid_filterButtonPrompt) isc.ListGrid.addProperties({filterButtonPrompt: isc.i18nMessages.listGrid_filterButtonPrompt});
												    if(isc.i18nMessages.listGrid_loadingMessage) isc.ListGrid.addProperties({loadingMessage: isc.i18nMessages.listGrid_loadingMessage});
												    if(isc.i18nMessages.listGrid_warnOnRemovalMessage) isc.ListGrid.addProperties({warnOnRemovalMessage: isc.i18nMessages.listGrid_warnOnRemovalMessage});
												    if(isc.i18nMessages.listGrid_sorterButtonTitle) isc.ListGrid.addProperties({sorterButtonTitle: isc.i18nMessages.listGrid_sorterButtonTitle});
												    if(isc.i18nMessages.listGrid_expansionEditorSaveDialogPrompt) isc.ListGrid.addProperties({expansionEditorSaveDialogPrompt: isc.i18nMessages.listGrid_expansionEditorSaveDialogPrompt});
												    if(isc.i18nMessages.listGrid_expansionEditorSaveButtonTitle) isc.ListGrid.addProperties({expansionEditorSaveButtonTitle: isc.i18nMessages.listGrid_expansionEditorSaveButtonTitle});
												    if(isc.i18nMessages.listGrid_formulaBuilderSpanTitleSeparator) isc.ListGrid.addProperties({formulaBuilderSpanTitleSeparator: isc.i18nMessages.listGrid_formulaBuilderSpanTitleSeparator});
												    if(isc.i18nMessages.listGrid_sortEditorSpanTitleSeparator) isc.ListGrid.addProperties({sortEditorSpanTitleSeparator: isc.i18nMessages.listGrid_sortEditorSpanTitleSeparator});
												    if(isc.i18nMessages.listGrid_hiliteEditorSpanTitleSeparator) isc.ListGrid.addProperties({hiliteEditorSpanTitleSeparator: isc.i18nMessages.listGrid_hiliteEditorSpanTitleSeparator});
												}
												    if(isc.i18nMessages.dataBoundComponent_fieldEditorWindowTitle) isc.Canvas.addProperties({fieldEditorWindowTitle: (isc.i18nMessages.dataBoundComponent_fieldEditorWindowTitle).replace(/(\$builderType)/g, '${builderType}').replace(/(\$fieldTitle)/g, '${fieldTitle}')});
												    if(isc.i18nMessages.dataBoundComponent_addFormulaFieldText) isc.Canvas.addProperties({addFormulaFieldText: isc.i18nMessages.dataBoundComponent_addFormulaFieldText});
												    if(isc.i18nMessages.dataBoundComponent_editFormulaFieldText) isc.Canvas.addProperties({editFormulaFieldText: isc.i18nMessages.dataBoundComponent_editFormulaFieldText});
												    if(isc.i18nMessages.dataBoundComponent_addSummaryFieldText) isc.Canvas.addProperties({addSummaryFieldText: isc.i18nMessages.dataBoundComponent_addSummaryFieldText});
												    if(isc.i18nMessages.dataBoundComponent_editSummaryFieldText) isc.Canvas.addProperties({editSummaryFieldText: isc.i18nMessages.dataBoundComponent_editSummaryFieldText});
												    if(isc.i18nMessages.dataBoundComponent_requiredFieldMessage) isc.Canvas.addProperties({requiredFieldMessage: isc.i18nMessages.dataBoundComponent_requiredFieldMessage});
												    if(isc.i18nMessages.dataBoundComponent_removeSummaryFieldText) isc.Canvas.addProperties({removeSummaryFieldText: isc.i18nMessages.dataBoundComponent_removeSummaryFieldText});
												    if(isc.i18nMessages.dataBoundComponent_removeFormulaFieldText) isc.Canvas.addProperties({removeFormulaFieldText: isc.i18nMessages.dataBoundComponent_removeFormulaFieldText});
												    if(isc.i18nMessages.dataBoundComponent_duplicateDragMessage) isc.Canvas.addProperties({duplicateDragMessage: isc.i18nMessages.dataBoundComponent_duplicateDragMessage});
												    if(isc.i18nMessages.dataBoundComponent_unknownErrorMessage) isc.Canvas.addProperties({unknownErrorMessage: isc.i18nMessages.dataBoundComponent_unknownErrorMessage});
												    if(isc.i18nMessages.dataBoundComponent_noErrorDetailsMessage) isc.Canvas.addProperties({noErrorDetailsMessage: isc.i18nMessages.dataBoundComponent_noErrorDetailsMessage});
												    if(isc.i18nMessages.dataBoundComponent_offlineMessage) isc.Canvas.addProperties({offlineMessage: isc.i18nMessages.dataBoundComponent_offlineMessage});
												    if(isc.i18nMessages.dataBoundComponent_editHilitesDialogTitle) isc.Canvas.addProperties({editHilitesDialogTitle: isc.i18nMessages.dataBoundComponent_editHilitesDialogTitle});
												    if(isc.i18nMessages.dataBoundComponent_offlineSaveMessage) isc.Canvas.addProperties({offlineSaveMessage: isc.i18nMessages.dataBoundComponent_offlineSaveMessage});
												    if(isc.i18nMessages.dataBoundComponent_emptyExportMessage) isc.Canvas.addProperties({emptyExportMessage: isc.i18nMessages.dataBoundComponent_emptyExportMessage});
												    if(isc.i18nMessages.dataBoundComponent_editHilitesText) isc.Canvas.addProperties({editHilitesText: isc.i18nMessages.dataBoundComponent_editHilitesText});
												if(isc.DataSource) {
												    if(isc.i18nMessages.dataSource_offlineMessage) isc.DataSource.addClassProperties({offlineMessage: isc.i18nMessages.dataSource_offlineMessage});
												    if(isc.i18nMessages.dataSource_maxFileSizeExceededMessage) isc.DataSource.addClassProperties({maxFileSizeExceededMessage: (isc.i18nMessages.dataSource_maxFileSizeExceededMessage).replace(/(\$uploadedFileName)/g, '${uploadedFileName}').replace(/(\$uploadedFileSize)/g, '${uploadedFileSize}').replace(/(\$maxFileSize)/g, '${maxFileSize}')});
												    if(isc.i18nMessages.dataSource_requiredFileMessage) isc.DataSource.addClassProperties({requiredFileMessage: (isc.i18nMessages.dataSource_requiredFileMessage).replace(/(\$uploadedFileName)/g, '${uploadedFileName}')});
												}
												if(isc.DetailViewer) {
												    if(isc.i18nMessages.detailViewer_configureFieldsText) isc.DetailViewer.addProperties({configureFieldsText: isc.i18nMessages.detailViewer_configureFieldsText});
												}
												if(isc.FacetChart) {
												    if(isc.i18nMessages.facetChart_regressionLinesContextMenuItemTitle) isc.FacetChart.addClassProperties({regressionLinesContextMenuItemTitle: isc.i18nMessages.facetChart_regressionLinesContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_hideRegressionLinesContextMenuItemTitle) isc.FacetChart.addClassProperties({hideRegressionLinesContextMenuItemTitle: isc.i18nMessages.facetChart_hideRegressionLinesContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_linearRegressionLinesContextMenuItemTitle) isc.FacetChart.addClassProperties({linearRegressionLinesContextMenuItemTitle: isc.i18nMessages.facetChart_linearRegressionLinesContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_polynomialRegressionLinesContextMenuItemTitle) isc.FacetChart.addClassProperties({polynomialRegressionLinesContextMenuItemTitle: isc.i18nMessages.facetChart_polynomialRegressionLinesContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_polynomialDegreeRegressionLinesContextMenuItemTitle) isc.FacetChart.addClassProperties({polynomialDegreeRegressionLinesContextMenuItemTitle: isc.i18nMessages.facetChart_polynomialDegreeRegressionLinesContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_polynomialDegreePrompt) isc.FacetChart.addClassProperties({polynomialDegreePrompt: isc.i18nMessages.facetChart_polynomialDegreePrompt});
												    if(isc.i18nMessages.facetChart_invalidPolynomialDegreeMessage) isc.FacetChart.addClassProperties({invalidPolynomialDegreeMessage: isc.i18nMessages.facetChart_invalidPolynomialDegreeMessage});
												    if(isc.i18nMessages.facetChart_proportionalContextMenuItemTitle) isc.FacetChart.addClassProperties({proportionalContextMenuItemTitle: isc.i18nMessages.facetChart_proportionalContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_chartTypeContextMenuItemTitle) isc.FacetChart.addClassProperties({chartTypeContextMenuItemTitle: isc.i18nMessages.facetChart_chartTypeContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_fillContextMenuItemTitle) isc.FacetChart.addClassProperties({fillContextMenuItemTitle: isc.i18nMessages.facetChart_fillContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_fillFilledContextMenuItemTitle) isc.FacetChart.addClassProperties({fillFilledContextMenuItemTitle: isc.i18nMessages.facetChart_fillFilledContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_fillUnfilledContextMenuItemTitle) isc.FacetChart.addClassProperties({fillUnfilledContextMenuItemTitle: isc.i18nMessages.facetChart_fillUnfilledContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_fillAutoContextMenuItemTitle) isc.FacetChart.addClassProperties({fillAutoContextMenuItemTitle: isc.i18nMessages.facetChart_fillAutoContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_stackContextMenuItemTitle) isc.FacetChart.addClassProperties({stackContextMenuItemTitle: isc.i18nMessages.facetChart_stackContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_stackStackedContextMenuItemTitle) isc.FacetChart.addClassProperties({stackStackedContextMenuItemTitle: isc.i18nMessages.facetChart_stackStackedContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_stackUnstackedContextMenuItemTitle) isc.FacetChart.addClassProperties({stackUnstackedContextMenuItemTitle: isc.i18nMessages.facetChart_stackUnstackedContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_stackAutoContextMenuItemTitle) isc.FacetChart.addClassProperties({stackAutoContextMenuItemTitle: isc.i18nMessages.facetChart_stackAutoContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_swapFacetsContextMenuItemTitle) isc.FacetChart.addClassProperties({swapFacetsContextMenuItemTitle: isc.i18nMessages.facetChart_swapFacetsContextMenuItemTitle});
												    if(isc.i18nMessages.facetChart_chartTypeAreaTitle) isc.FacetChart.addClassProperties({chartTypeAreaTitle: isc.i18nMessages.facetChart_chartTypeAreaTitle});
												    if(isc.i18nMessages.facetChart_chartTypeColumnTitle) isc.FacetChart.addClassProperties({chartTypeColumnTitle: isc.i18nMessages.facetChart_chartTypeColumnTitle});
												    if(isc.i18nMessages.facetChart_chartTypeBarTitle) isc.FacetChart.addClassProperties({chartTypeBarTitle: isc.i18nMessages.facetChart_chartTypeBarTitle});
												    if(isc.i18nMessages.facetChart_chartTypeLineTitle) isc.FacetChart.addClassProperties({chartTypeLineTitle: isc.i18nMessages.facetChart_chartTypeLineTitle});
												    if(isc.i18nMessages.facetChart_chartTypeRadarTitle) isc.FacetChart.addClassProperties({chartTypeRadarTitle: isc.i18nMessages.facetChart_chartTypeRadarTitle});
												    if(isc.i18nMessages.facetChart_chartTypePieTitle) isc.FacetChart.addClassProperties({chartTypePieTitle: isc.i18nMessages.facetChart_chartTypePieTitle});
												    if(isc.i18nMessages.facetChart_chartTypeDoughnutTitle) isc.FacetChart.addClassProperties({chartTypeDoughnutTitle: isc.i18nMessages.facetChart_chartTypeDoughnutTitle});
												    if(isc.i18nMessages.facetChart_chartTypeScatterTitle) isc.FacetChart.addClassProperties({chartTypeScatterTitle: isc.i18nMessages.facetChart_chartTypeScatterTitle});
												    if(isc.i18nMessages.facetChart_chartTypeBubbleTitle) isc.FacetChart.addClassProperties({chartTypeBubbleTitle: isc.i18nMessages.facetChart_chartTypeBubbleTitle});
												    if(isc.i18nMessages.facetChart_chartTypeHistogramTitle) isc.FacetChart.addClassProperties({chartTypeHistogramTitle: isc.i18nMessages.facetChart_chartTypeHistogramTitle});
												}
												if(isc.TileGrid) {
												    if(isc.i18nMessages.tileGrid_emptyMessage) isc.TileGrid.addProperties({emptyMessage: isc.i18nMessages.tileGrid_emptyMessage});
												}
												if(isc.TreeGrid) {
												    if(isc.i18nMessages.treeGrid_parentAlreadyContainsChildMessage) isc.TreeGrid.addProperties({parentAlreadyContainsChildMessage: isc.i18nMessages.treeGrid_parentAlreadyContainsChildMessage});
												    if(isc.i18nMessages.treeGrid_cantDragIntoSelfMessage) isc.TreeGrid.addProperties({cantDragIntoSelfMessage: isc.i18nMessages.treeGrid_cantDragIntoSelfMessage});
												    if(isc.i18nMessages.treeGrid_cantDragIntoChildMessage) isc.TreeGrid.addProperties({cantDragIntoChildMessage: isc.i18nMessages.treeGrid_cantDragIntoChildMessage});
												    if(isc.i18nMessages.treeGrid_offlineNodeMessage) isc.TreeGrid.addProperties({offlineNodeMessage: isc.i18nMessages.treeGrid_offlineNodeMessage});
												}
												if(isc.ColumnTree) {
												    if(isc.i18nMessages.columnTree_backButtonTitle) isc.ColumnTree.addProperties({backButtonTitle: isc.i18nMessages.columnTree_backButtonTitle});
												}
												if(isc.FormulaBuilder) {
												    if(isc.i18nMessages.formulaBuilder_autoHideCheckBoxLabel) isc.FormulaBuilder.addProperties({autoHideCheckBoxLabel: isc.i18nMessages.formulaBuilder_autoHideCheckBoxLabel});
												    if(isc.i18nMessages.formulaBuilder_helpTextIntro) isc.FormulaBuilder.addProperties({helpTextIntro: isc.i18nMessages.formulaBuilder_helpTextIntro});
												    if(isc.i18nMessages.formulaBuilder_instructionsTextStart) isc.FormulaBuilder.addProperties({instructionsTextStart: (isc.i18nMessages.formulaBuilder_instructionsTextStart).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_samplePromptForRecord) isc.FormulaBuilder.addProperties({samplePrompt: '<nobr>' + isc.i18nMessages.formulaBuilder_samplePromptForRecord + ' ${title}</nobr><br><nobr>' + isc.i18nMessages.formulaBuilder_samplePromptOutput + ' ${output}</nobr>'});
												    if(isc.i18nMessages.formulaBuilder_builderTypeText) isc.FormulaBuilder.addProperties({builderTypeText: isc.i18nMessages.formulaBuilder_builderTypeText});
												    if(isc.i18nMessages.formulaBuilder_invalidBuilderPrompt) isc.FormulaBuilder.addProperties({invalidBuilderPrompt: (isc.i18nMessages.formulaBuilder_invalidBuilderPrompt).replace(/(\$builderType)/g, '${builderType}').replace(/(\$errorText)/g, '${errorText}')});
												    if(isc.i18nMessages.formulaBuilder_invalidBlankPrompt) isc.FormulaBuilder.addProperties({invalidBlankPrompt: (isc.i18nMessages.formulaBuilder_invalidBlankPrompt).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_validBuilderPrompt) isc.FormulaBuilder.addProperties({validBuilderPrompt: (isc.i18nMessages.formulaBuilder_validBuilderPrompt).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_helpWindowTitle) isc.FormulaBuilder.addProperties({helpWindowTitle: (isc.i18nMessages.formulaBuilder_helpWindowTitle).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_saveConfirmationPrompt) isc.FormulaBuilder.addProperties({saveConfirmationPrompt: (isc.i18nMessages.formulaBuilder_saveConfirmationPrompt).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_invalidGeneratedFunctionPrompt) isc.FormulaBuilder.addProperties({invalidGeneratedFunctionPrompt: (isc.i18nMessages.formulaBuilder_invalidGeneratedFunctionPrompt).replace(/(\$builderType)/g, '${builderType}')});
												    if(isc.i18nMessages.formulaBuilder_titleFieldTitle) isc.FormulaBuilder.addProperties({titleFieldTitle: isc.i18nMessages.formulaBuilder_titleFieldTitle});
												    if(isc.i18nMessages.formulaBuilder_defaultNewFieldTitle) isc.FormulaBuilder.addProperties({defaultNewFieldTitle: isc.i18nMessages.formulaBuilder_defaultNewFieldTitle});
												    if(isc.i18nMessages.formulaBuilder_keyColumnTitle) isc.FormulaBuilder.addProperties({keyColumnTitle: isc.i18nMessages.formulaBuilder_keyColumnTitle});
												    if(isc.i18nMessages.formulaBuilder_sourceFieldColumnTitle) isc.FormulaBuilder.addProperties({sourceFieldColumnTitle: isc.i18nMessages.formulaBuilder_sourceFieldColumnTitle});
												    if(isc.i18nMessages.formulaBuilder_cancelButtonTitle) isc.FormulaBuilder.addProperties({cancelButtonTitle: isc.i18nMessages.formulaBuilder_cancelButtonTitle});
												    if(isc.i18nMessages.formulaBuilder_saveButtonTitle) isc.FormulaBuilder.addProperties({saveButtonTitle: isc.i18nMessages.formulaBuilder_saveButtonTitle});
												    if(isc.i18nMessages.formulaBuilder_sampleHeaderTitle) isc.FormulaBuilder.addProperties({sampleHeaderTitle: isc.i18nMessages.formulaBuilder_sampleHeaderTitle});
												    if(isc.i18nMessages.formulaBuilder_testButtonTitle) isc.FormulaBuilder.addProperties({testButtonTitle: isc.i18nMessages.formulaBuilder_testButtonTitle});
												    if(isc.i18nMessages.formulaBuilder_defaultErrorText) isc.FormulaBuilder.addProperties({defaultErrorText: isc.i18nMessages.formulaBuilder_defaultErrorText});
												    if(isc.i18nMessages.formulaBuilder_saveAddAnotherButtonTitle) isc.FormulaBuilder.addProperties({saveAddAnotherButtonTitle: isc.i18nMessages.formulaBuilder_saveAddAnotherButtonTitle});
												    if(isc.i18nMessages.formulaBuilder_warnDuplicateTitlesMessage) isc.FormulaBuilder.addProperties({warnDuplicateTitlesMessage: isc.i18nMessages.formulaBuilder_warnDuplicateTitlesMessage});
												    if(isc.i18nMessages.formulaBuilder_sourceDSColumnTitle) isc.FormulaBuilder.addProperties({sourceDSColumnTitle: isc.i18nMessages.formulaBuilder_sourceDSColumnTitle});
												}
												if(isc.SummaryBuilder) {
												    if(isc.i18nMessages.summaryBuilder_autoHideCheckBoxLabel) isc.SummaryBuilder.addProperties({autoHideCheckBoxLabel: isc.i18nMessages.summaryBuilder_autoHideCheckBoxLabel});
												    if(isc.i18nMessages.summaryBuilder_helpTextIntro) isc.SummaryBuilder.addProperties({helpTextIntro: isc.i18nMessages.summaryBuilder_helpTextIntro});
												    if(isc.i18nMessages.summaryBuilder_builderTypeText) isc.SummaryBuilder.addProperties({builderTypeText: isc.i18nMessages.summaryBuilder_builderTypeText});
												}
												if(isc.PrintWindow) {
												    if(isc.i18nMessages.printWindow_printButtonTitle) isc.PrintWindow.addProperties({printButtonTitle: isc.i18nMessages.printWindow_printButtonTitle});
												    if(isc.i18nMessages.printWindow_title) isc.PrintWindow.addProperties({title: isc.i18nMessages.printWindow_title});
												}
												if(isc.PickTreeItem) {
												    if(isc.i18nMessages.pickTreeItem_emptyMenuMessage) isc.PickTreeItem.addProperties({emptyMenuMessage: isc.i18nMessages.pickTreeItem_emptyMenuMessage});
												}
												if(isc.MultiFileItem) {
												    if(isc.i18nMessages.multiFileItem_emptyMessage) isc.MultiFileItem.addProperties({emptyMessage: isc.i18nMessages.multiFileItem_emptyMessage});
												    if(isc.i18nMessages.multiFileItem_editButtonPrompt) isc.MultiFileItem.addProperties({editButtonPrompt: isc.i18nMessages.multiFileItem_editButtonPrompt});
												    if(isc.i18nMessages.multiFileItem_removeButtonPrompt) isc.MultiFileItem.addProperties({removeButtonPrompt: isc.i18nMessages.multiFileItem_removeButtonPrompt});
												    if(isc.i18nMessages.multiFileItem_pickerUploadButtonInitialTitle) isc.MultiFileItem.addProperties({pickerUploadButtonInitialTitle: isc.i18nMessages.multiFileItem_pickerUploadButtonInitialTitle});
												    if(isc.i18nMessages.multiFileItem_pickerUploadButtonTitle) isc.MultiFileItem.addProperties({pickerUploadButtonTitle: isc.i18nMessages.multiFileItem_pickerUploadButtonTitle});
												    if(isc.i18nMessages.multiFileItem_pickerCancelButtonTitle) isc.MultiFileItem.addProperties({pickerCancelButtonTitle: isc.i18nMessages.multiFileItem_pickerCancelButtonTitle});
												    if(isc.i18nMessages.multiFileItem_pickerAddAnotherFileButtonTitle) isc.MultiFileItem.addProperties({pickerAddAnotherFileButtonTitle: isc.i18nMessages.multiFileItem_pickerAddAnotherFileButtonTitle});
												    if(isc.i18nMessages.multiFileItem_pickerUploadProgressLabel) isc.MultiFileItem.addProperties({pickerUploadProgressLabel: (isc.i18nMessages.multiFileItem_pickerUploadProgressLabel).replace(/(\$fileName)/g, '${fileName}').replace(/(\$formattedFileSize)/g, '${formattedFileSize}')});
												}
												if(isc.MenuButton) {
												    if(isc.i18nMessages.menuButton_title) isc.MenuButton.addProperties({title: isc.i18nMessages.menuButton_title});
												}
												if(isc.TreeMenuButton) {
												    if(isc.i18nMessages.treeMenuButton_unselectedTitle) isc.TreeMenuButton.addProperties({unselectedTitle: isc.i18nMessages.treeMenuButton_unselectedTitle});
												}
												if(isc.Calendar) {
												    if(isc.i18nMessages.calendar_invalidDateMessage) isc.Calendar.addProperties({invalidDateMessage: isc.i18nMessages.calendar_invalidDateMessage});
												    if(isc.i18nMessages.calendar_addEventButtonHoverText) isc.Calendar.addProperties({addEventButtonHoverText: isc.i18nMessages.calendar_addEventButtonHoverText});
												    if(isc.i18nMessages.calendar_cancelButtonTitle) isc.Calendar.addProperties({cancelButtonTitle: isc.i18nMessages.calendar_cancelButtonTitle});
												    if(isc.i18nMessages.calendar_datePickerHoverText) isc.Calendar.addProperties({datePickerHoverText: isc.i18nMessages.calendar_datePickerHoverText});
												    if(isc.i18nMessages.calendar_dayViewTitle) isc.Calendar.addProperties({dayViewTitle: isc.i18nMessages.calendar_dayViewTitle});
												    if(isc.i18nMessages.calendar_detailsButtonTitle) isc.Calendar.addProperties({detailsButtonTitle: isc.i18nMessages.calendar_detailsButtonTitle});
												    if(isc.i18nMessages.calendar_eventNameFieldTitle) isc.Calendar.addProperties({eventNameFieldTitle: isc.i18nMessages.calendar_eventNameFieldTitle});
												    if(isc.i18nMessages.calendar_eventDescriptionFieldTitle) isc.Calendar.addProperties({eventDescriptionFieldTitle: isc.i18nMessages.calendar_eventDescriptionFieldTitle});
												    if(isc.i18nMessages.calendar_eventStartDateFieldTitle) isc.Calendar.addProperties({eventStartDateFieldTitle: isc.i18nMessages.calendar_eventStartDateFieldTitle});
												    if(isc.i18nMessages.calendar_eventEndDateFieldTitle) isc.Calendar.addProperties({eventEndDateFieldTitle: isc.i18nMessages.calendar_eventEndDateFieldTitle});
												    if(isc.i18nMessages.calendar_eventLaneFieldTitle) isc.Calendar.addProperties({eventLaneFieldTitle: isc.i18nMessages.calendar_eventLaneFieldTitle});
												    if(isc.i18nMessages.calendar_monthViewTitle) isc.Calendar.addProperties({monthViewTitle: isc.i18nMessages.calendar_monthViewTitle});
												    if(isc.i18nMessages.calendar_nextButtonHoverText) isc.Calendar.addProperties({nextButtonHoverText: isc.i18nMessages.calendar_nextButtonHoverText});
												    if(isc.i18nMessages.calendar_previousButtonHoverText) isc.Calendar.addProperties({previousButtonHoverText: isc.i18nMessages.calendar_previousButtonHoverText});
												    if(isc.i18nMessages.calendar_removeButtonTitle) isc.Calendar.addProperties({removeButtonTitle: isc.i18nMessages.calendar_removeButtonTitle});
												    if(isc.i18nMessages.calendar_saveButtonTitle) isc.Calendar.addProperties({saveButtonTitle: isc.i18nMessages.calendar_saveButtonTitle});
												    if(isc.i18nMessages.calendar_timelineViewTitle) isc.Calendar.addProperties({timelineViewTitle: isc.i18nMessages.calendar_timelineViewTitle});
												    if(isc.i18nMessages.calendar_weekViewTitle) isc.Calendar.addProperties({weekViewTitle: isc.i18nMessages.calendar_weekViewTitle});
												    if(isc.i18nMessages.calendar_weekPrefix) isc.Calendar.addProperties({weekPrefix: isc.i18nMessages.calendar_weekPrefix});
												    if(isc.i18nMessages.calendar_monthButtonTitle) isc.Calendar.addProperties({monthButtonTitle: (isc.i18nMessages.calendar_monthButtonTitle).replace(/(\$monthName)/g, '${monthName}')});
												    if(isc.i18nMessages.calendar_backButtonTitle) isc.Calendar.addProperties({backButtonTitle: isc.i18nMessages.calendar_backButtonTitle});
												    if(isc.i18nMessages.calendar_eventSublaneFieldTitle) isc.Calendar.addProperties({eventSublaneFieldTitle: isc.i18nMessages.calendar_eventSublaneFieldTitle});
												    if(isc.i18nMessages.calendar_eventDurationFieldTitle) isc.Calendar.addProperties({eventDurationFieldTitle: isc.i18nMessages.calendar_eventDurationFieldTitle});
												    if(isc.i18nMessages.calendar_eventDurationUnitFieldTitle) isc.Calendar.addProperties({eventDurationUnitFieldTitle: isc.i18nMessages.calendar_eventDurationUnitFieldTitle});
												    if(isc.i18nMessages.calendar_monthMoreEventsLinkTitle) isc.Calendar.addProperties({monthMoreEventsLinkTitle: (isc.i18nMessages.calendar_monthMoreEventsLinkTitle).replace(/(\$eventCount)/g, '${eventCount}')});
												}
												if(isc.FilterBuilder) {
												    if(isc.i18nMessages.filterBuilder_addButtonPrompt) isc.FilterBuilder.addProperties({addButtonPrompt: isc.i18nMessages.filterBuilder_addButtonPrompt});
												    if(isc.i18nMessages.filterBuilder_rangeSeparator) isc.FilterBuilder.addProperties({rangeSeparator: isc.i18nMessages.filterBuilder_rangeSeparator});
												    if(isc.i18nMessages.filterBuilder_removeButtonPrompt) isc.FilterBuilder.addProperties({removeButtonPrompt: isc.i18nMessages.filterBuilder_removeButtonPrompt});
												    if(isc.i18nMessages.filterBuilder_subClauseButtonPrompt) isc.FilterBuilder.addProperties({subClauseButtonPrompt: isc.i18nMessages.filterBuilder_subClauseButtonPrompt});
												    if(isc.i18nMessages.filterBuilder_subClauseButtonPrompt) isc.FilterBuilder.addProperties({subClauseButtonPrompt: isc.i18nMessages.filterBuilder_subClauseButtonPrompt});
												    if(isc.i18nMessages.filterBuilder_missingFieldPrompt) isc.FilterBuilder.addProperties({missingFieldPrompt: isc.i18nMessages.filterBuilder_missingFieldPrompt});
												    if(isc.i18nMessages.filterBuilder_matchAllTitle) isc.FilterBuilder.addProperties({matchAllTitle: isc.i18nMessages.filterBuilder_matchAllTitle});
												    if(isc.i18nMessages.filterBuilder_matchNoneTitle) isc.FilterBuilder.addProperties({matchNoneTitle: isc.i18nMessages.filterBuilder_matchNoneTitle});
												    if(isc.i18nMessages.filterBuilder_matchAnyTitle) isc.FilterBuilder.addProperties({matchAnyTitle: isc.i18nMessages.filterBuilder_matchAnyTitle});
												    if(isc.i18nMessages.filterBuilder_subClauseButtonTitle) isc.FilterBuilder.addProperties({subClauseButtonTitle: isc.i18nMessages.filterBuilder_subClauseButtonTitle});
												    if(isc.i18nMessages.filterBuilder_operatorPickerTitle) isc.FilterBuilder.addProperties({operatorPickerTitle: isc.i18nMessages.filterBuilder_operatorPickerTitle});
												    if(isc.i18nMessages.filterBuilder_fieldPickerTitle) isc.FilterBuilder.addProperties({fieldPickerTitle: isc.i18nMessages.filterBuilder_fieldPickerTitle});
												    if(isc.i18nMessages.filterBuilder_radioOperatorTitle) isc.FilterBuilder.addProperties({radioOperatorTitle: isc.i18nMessages.filterBuilder_radioOperatorTitle});
												    if(isc.i18nMessages.filterBuilder_topOperatorTitle) isc.FilterBuilder.addProperties({topOperatorTitle: isc.i18nMessages.filterBuilder_topOperatorTitle});
												    if(isc.i18nMessages.FilterBuilder_inlineAndTitle) isc.FilterBuilder.addProperties({inlineAndTitle: isc.i18nMessages.FilterBuilder_inlineAndTitle});
												    if(isc.i18nMessages.FilterBuilder_inlineOrTitle) isc.FilterBuilder.addProperties({inlineOrTitle: isc.i18nMessages.FilterBuilder_inlineOrTitle});
												    if(isc.i18nMessages.FilterBuilder_inlineAndNotTitle) isc.FilterBuilder.addProperties({inlineAndNotTitle: isc.i18nMessages.FilterBuilder_inlineAndNotTitle});
												    if(isc.i18nMessages.FilterBuilder_modeSwitcherAdvancedMessage) isc.FilterBuilder.addProperties({modeSwitcherAdvancedMessage: isc.i18nMessages.FilterBuilder_modeSwitcherAdvancedMessage});
												    if(isc.i18nMessages.FilterBuilder_modeSwitcherSimpleMessage) isc.FilterBuilder.addProperties({modeSwitcherSimpleMessage: isc.i18nMessages.FilterBuilder_modeSwitcherSimpleMessage});
												    if(isc.i18nMessages.FilterBuilder_modeSwitcherFlattenWarningMessage) isc.FilterBuilder.addProperties({modeSwitcherFlattenWarningMessage: isc.i18nMessages.FilterBuilder_modeSwitcherFlattenWarningMessage});
												}
												if(isc.FilterClause) {
												    if(isc.i18nMessages.filterClause_removeButtonPrompt) isc.FilterClause.addProperties({removeButtonPrompt: isc.i18nMessages.filterClause_removeButtonPrompt});
												    if(isc.i18nMessages.filterClause_fieldPickerTitle) isc.FilterClause.addProperties({fieldPickerTitle: isc.i18nMessages.filterClause_fieldPickerTitle});
												    if(isc.i18nMessages.filterClause_valueItemTitle) isc.FilterClause.addProperties({valueItemTitle: isc.i18nMessages.filterClause_valueItemTitle});
												    if(isc.i18nMessages.filterClause_operatorPickerTitle) isc.FilterClause.addProperties({operatorPickerTitle: isc.i18nMessages.filterClause_operatorPickerTitle});
												    if(isc.i18nMessages.filterClause_valueSetHint) isc.FilterClause.addProperties({valueSetHint: isc.i18nMessages.filterClause_valueSetHint});
												    if(isc.i18nMessages.filterClause_valueItemTextHint) isc.FilterClause.addProperties({valueItemTextHint: isc.i18nMessages.filterClause_valueItemTextHint});
												    if(isc.i18nMessages.filterClause_valueItemListHint) isc.FilterClause.addProperties({valueItemListHint: isc.i18nMessages.filterClause_valueItemListHint});
												    if(isc.i18nMessages.filterClause_valueItemFieldHint) isc.FilterClause.addProperties({valueItemFieldHint: isc.i18nMessages.filterClause_valueItemFieldHint});
												}
												if(isc.FieldPickerField) {
												    if(isc.i18nMessages.fieldPickerField_frozenTitle) isc.FieldPickerField.addClassProperties({frozenTitle: isc.i18nMessages.fieldPickerField_frozenTitle});
												    if(isc.i18nMessages.fieldPickerField_precisionTitle) isc.FieldPickerField.addClassProperties({precisionTitle: isc.i18nMessages.fieldPickerField_precisionTitle});
												    if(isc.i18nMessages.fieldPickerField_decimalPrecisionTitle) isc.FieldPickerField.addClassProperties({decimalPrecisionTitle: isc.i18nMessages.fieldPickerField_decimalPrecisionTitle});
												    if(isc.i18nMessages.fieldPickerField_decimalPadTitle) isc.FieldPickerField.addClassProperties({decimalPadTitle: isc.i18nMessages.fieldPickerField_decimalPadTitle});
												    if(isc.i18nMessages.fieldPickerField_alignTitle) isc.FieldPickerField.addClassProperties({alignTitle: isc.i18nMessages.fieldPickerField_alignTitle});
												    if(isc.i18nMessages.fieldPickerField_cellAlignTitle) isc.FieldPickerField.addClassProperties({cellAlignTitle: isc.i18nMessages.fieldPickerField_cellAlignTitle});
												}
												if(isc.FieldPicker) {
												    if(isc.i18nMessages.fieldPicker_hilitesText) isc.FieldPicker.addProperties({hilitesText: isc.i18nMessages.fieldPicker_hilitesText});
												    if(isc.i18nMessages.fieldPicker_availableFieldsTitle) isc.FieldPicker.addProperties({availableFieldsTitle: isc.i18nMessages.fieldPicker_availableFieldsTitle});
												    if(isc.i18nMessages.fieldPicker_currentFieldsTitle) isc.FieldPicker.addProperties({currentFieldsTitle: isc.i18nMessages.fieldPicker_currentFieldsTitle});
												    if(isc.i18nMessages.fieldPicker_confirmText) isc.FieldPicker.addProperties({confirmText: isc.i18nMessages.fieldPicker_confirmText});
												    if(isc.i18nMessages.fieldPicker_removeText) isc.FieldPicker.addProperties({removeText: isc.i18nMessages.fieldPicker_removeText});
												    if(isc.i18nMessages.fieldPicker_instructions) isc.FieldPicker.addProperties({instructions: isc.i18nMessages.fieldPicker_instructions});
												    if(isc.i18nMessages.fieldPicker_saveAndExitButtonTitle) isc.FieldPicker.addProperties({saveAndExitButtonTitle: isc.i18nMessages.fieldPicker_saveAndExitButtonTitle});
												    if(isc.i18nMessages.fieldPicker_cancelButtonTitle) isc.FieldPicker.addProperties({cancelButtonTitle: isc.i18nMessages.fieldPicker_cancelButtonTitle});
												    if(isc.i18nMessages.fieldPicker_addCustomFieldsButtonTitle) isc.FieldPicker.addProperties({addCustomFieldsButtonTitle: isc.i18nMessages.fieldPicker_addCustomFieldsButtonTitle});
												    if(isc.i18nMessages.fieldPicker_availableTitleTitle) isc.FieldPicker.addProperties({availableTitleTitle: isc.i18nMessages.fieldPicker_availableTitleTitle});
												    if(isc.i18nMessages.fieldPicker_currentTitleTitle) isc.FieldPicker.addProperties({currentTitleTitle: isc.i18nMessages.fieldPicker_currentTitleTitle});
												    if(isc.i18nMessages.fieldPicker_sampleValueTitle) isc.FieldPicker.addProperties({sampleValueTitle: isc.i18nMessages.fieldPicker_sampleValueTitle});
												    if(isc.i18nMessages.fieldPicker_removeItemTitle) isc.FieldPicker.addProperties({removeItemTitle: isc.i18nMessages.fieldPicker_removeItemTitle});
												    if(isc.i18nMessages.fieldPicker_emptyTitleHint) isc.FieldPicker.addProperties({emptyTitleHint: isc.i18nMessages.fieldPicker_emptyTitleHint});
												}
												if(isc.FieldPickerWindow) {
												    if(isc.i18nMessages.fieldPickerWindow_title) isc.FieldPickerWindow.addProperties({title: isc.i18nMessages.fieldPickerWindow_title});
												}
												if(isc.MultiSortDialog) {
												    if(isc.i18nMessages.multiSortDialog_addLevelButtonTitle) isc.MultiSortPanel.addProperties({addLevelButtonTitle: isc.i18nMessages.multiSortDialog_addLevelButtonTitle});
												    if(isc.i18nMessages.multiSortDialog_deleteLevelButtonTitle) isc.MultiSortPanel.addProperties({deleteLevelButtonTitle: isc.i18nMessages.multiSortDialog_deleteLevelButtonTitle});
												    if(isc.i18nMessages.multiSortDialog_copyLevelButtonTitle) isc.MultiSortPanel.addProperties({copyLevelButtonTitle: isc.i18nMessages.multiSortDialog_copyLevelButtonTitle});
												    if(isc.i18nMessages.multiSortDialog_invalidListPrompt) isc.MultiSortPanel.addProperties({invalidListPrompt: (isc.i18nMessages.multiSortDialog_invalidListPrompt).replace(/(\$title)/g, '${title}')});
												    if(isc.i18nMessages.multiSortDialog_propertyFieldTitle) isc.MultiSortPanel.addProperties({propertyFieldTitle: isc.i18nMessages.multiSortDialog_propertyFieldTitle});
												    if(isc.i18nMessages.multiSortDialog_directionFieldTitle) isc.MultiSortPanel.addProperties({directionFieldTitle: isc.i18nMessages.multiSortDialog_directionFieldTitle});
												    if(isc.i18nMessages.multiSortDialog_ascendingTitle) isc.MultiSortPanel.addProperties({ascendingTitle: isc.i18nMessages.multiSortDialog_ascendingTitle});
												    if(isc.i18nMessages.multiSortDialog_descendingTitle) isc.MultiSortPanel.addProperties({descendingTitle: isc.i18nMessages.multiSortDialog_descendingTitle});
												    if(isc.i18nMessages.multiSortDialog_firstSortLevelTitle) isc.MultiSortPanel.addProperties({firstSortLevelTitle: isc.i18nMessages.multiSortDialog_firstSortLevelTitle});
												    if(isc.i18nMessages.multiSortDialog_otherSortLevelTitle) isc.MultiSortPanel.addProperties({otherSortLevelTitle: isc.i18nMessages.multiSortDialog_otherSortLevelTitle});  
												    if(isc.i18nMessages.multiSortDialog_title) isc.MultiSortDialog.addProperties({title: isc.i18nMessages.multiSortDialog_title});
												    if(isc.i18nMessages.multiSortDialog_applyButtonTitle) isc.MultiSortDialog.addProperties({applyButtonTitle: isc.i18nMessages.multiSortDialog_applyButtonTitle});
												    if(isc.i18nMessages.multiSortDialog_cancelButtonTitle) isc.MultiSortDialog.addProperties({cancelButtonTitle: isc.i18nMessages.multiSortDialog_cancelButtonTitle});
												    if(isc.i18nMessages.multiSortDialog_levelUpPrompt) isc.MultiSortDialog.addProperties({levelUpButtonTitle: isc.i18nMessages.multiSortDialog_levelUpPrompt});
												    if(isc.i18nMessages.multiSortDialog_levelDownPrompt) isc.MultiSortDialog.addProperties({levelDownButtonTitle: isc.i18nMessages.multiSortDialog_levelDownPrompt});
												}
												if(isc.MultiGroupDialog) {
												    if(isc.i18nMessages.multiGroupDialog_addLevelButtonTitle) isc.MultiGroupPanel.addProperties({addLevelButtonTitle: isc.i18nMessages.multiGroupDialog_addLevelButtonTitle});
												    if(isc.i18nMessages.multiGroupDialog_deleteLevelButtonTitle) isc.MultiGroupPanel.addProperties({deleteLevelButtonTitle: isc.i18nMessages.multiGroupDialog_deleteLevelButtonTitle});
												    if(isc.i18nMessages.multiGroupDialog_copyLevelButtonTitle) isc.MultiGroupPanel.addProperties({copyLevelButtonTitle: isc.i18nMessages.multiGroupDialog_copyLevelButtonTitle});
												    if(isc.i18nMessages.multiGroupDialog_invalidListPrompt) isc.MultiGroupPanel.addProperties({invalidListPrompt: (isc.i18nMessages.multiGroupDialog_invalidListPrompt).replace(/(\$title)/g, '${title}')});
												    if(isc.i18nMessages.multiGroupDialog_groupingFieldTitle) isc.MultiGroupPanel.addProperties({groupingFieldTitle: isc.i18nMessages.multiGroupDialog_groupingFieldTitle});
												    if(isc.i18nMessages.multiGroupDialog_propertyFieldTitle) isc.MultiGroupPanel.addProperties({propertyFieldTitle: isc.i18nMessages.multiGroupDialog_propertyFieldTitle});
												    if(isc.i18nMessages.multiGroupDialog_firstGroupLevelTitle) isc.MultiGroupPanel.addProperties({firstGroupLevelTitle: isc.i18nMessages.multiGroupDialog_firstGroupLevelTitle});
												    if(isc.i18nMessages.multiGroupDialog_otherGroupLevelTitle) isc.MultiGroupPanel.addProperties({otherGroupLevelTitle: isc.i18nMessages.multiGroupDialog_otherGroupLevelTitle});  
												    if(isc.i18nMessages.multiGroupDialog_title) isc.MultiGroupDialog.addProperties({title: isc.i18nMessages.multiGroupDialog_title});
												    if(isc.i18nMessages.multiGroupDialog_applyButtonTitle) isc.MultiGroupDialog.addProperties({applyButtonTitle: isc.i18nMessages.multiGroupDialog_applyButtonTitle});
												    if(isc.i18nMessages.multiGroupDialog_cancelButtonTitle) isc.MultiGroupDialog.addProperties({cancelButtonTitle: isc.i18nMessages.multiGroupDialog_cancelButtonTitle});
												    if(isc.i18nMessages.multiGroupDialog_levelUpPrompt) isc.MultiGroupDialog.addProperties({levelUpButtonTitle: isc.i18nMessages.multiGroupDialog_levelUpPrompt});
												    if(isc.i18nMessages.multiGroupDialog_levelDownPrompt) isc.MultiGroupDialog.addProperties({levelDownButtonTitle: isc.i18nMessages.multiGroupDialog_levelDownPrompt});
												}
												if(isc.HiliteRule) {
												    if(isc.i18nMessages.hiliteRule_removeButtonPrompt) isc.HiliteRule.addProperties({removeButtonPrompt: isc.i18nMessages.hiliteRule_removeButtonPrompt});
												    if(isc.i18nMessages.hiliteRule_colorFieldTitle) isc.HiliteRule.addProperties({colorFieldTitle: isc.i18nMessages.hiliteRule_colorFieldTitle});
												    if(isc.i18nMessages.hiliteRule_iconFieldTitle) isc.HiliteRule.addProperties({iconFieldTitle: isc.i18nMessages.hiliteRule_iconFieldTitle});
												    if(isc.i18nMessages.hiliteRule_foregroundColorTitle) isc.HiliteRule.addProperties({foregroundColorTitle: isc.i18nMessages.hiliteRule_foregroundColorTitle});
												    if(isc.i18nMessages.hiliteRule_backgroundColorTitle) isc.HiliteRule.addProperties({backgroundColorTitle: isc.i18nMessages.hiliteRule_backgroundColorTitle});
												}
												if(isc.HiliteEditor) {
												    if(isc.i18nMessages.hiliteEditor_addAdvancedRuleButtonTitle) isc.HiliteEditor.addProperties({addAdvancedRuleButtonTitle: isc.i18nMessages.hiliteEditor_addAdvancedRuleButtonTitle});
												    if(isc.i18nMessages.hiliteEditor_saveButtonTitle) isc.HiliteEditor.addProperties({saveButtonTitle: isc.i18nMessages.hiliteEditor_saveButtonTitle});
												    if(isc.i18nMessages.hiliteEditor_cancelButtonTitle) isc.HiliteEditor.addProperties({cancelButtonTitle: isc.i18nMessages.hiliteEditor_cancelButtonTitle});
												    if(isc.i18nMessages.hiliteEditor_availableFieldsColumnTitle) isc.HiliteEditor.addProperties({availableFieldsColumnTitle: isc.i18nMessages.hiliteEditor_availableFieldsColumnTitle});
												}
												if(isc.AdvancedHiliteEditor) {
												    if(isc.i18nMessages.advancedHiliteEditor_title) isc.AdvancedHiliteEditor.addProperties({title: isc.i18nMessages.advancedHiliteEditor_title});
												    if(isc.i18nMessages.advancedHiliteEditor_saveButtonTitle) isc.AdvancedHiliteEditor.addProperties({saveButtonTitle: isc.i18nMessages.advancedHiliteEditor_saveButtonTitle});
												    if(isc.i18nMessages.advancedHiliteEditor_cancelButtonTitle) isc.AdvancedHiliteEditor.addProperties({cancelButtonTitle: isc.i18nMessages.advancedHiliteEditor_cancelButtonTitle});
												    if(isc.i18nMessages.advancedHiliteEditor_invalidHilitePrompt) isc.AdvancedHiliteEditor.addProperties({invalidHilitePrompt: isc.i18nMessages.advancedHiliteEditor_invalidHilitePrompt});
												    if(isc.i18nMessages.advancedHiliteEditor_filterGroupTitle) isc.AdvancedHiliteEditor.addProperties({filterGroupTitle: isc.i18nMessages.advancedHiliteEditor_filterGroupTitle});
												    if(isc.i18nMessages.advancedHiliteEditor_appearanceGroupTitle) isc.AdvancedHiliteEditor.addProperties({appearanceGroupTitle: isc.i18nMessages.advancedHiliteEditor_appearanceGroupTitle});
												    if(isc.i18nMessages.advancedHiliteEditor_targetFieldsItemTitle) isc.AdvancedHiliteEditor.addProperties({targetFieldsItemTitle: isc.i18nMessages.advancedHiliteEditor_targetFieldsItemTitle});
												    if(isc.i18nMessages.advancedHiliteEditor_invalidCriteriaPrompt) isc.AdvancedHiliteEditor.addProperties({invalidCriteriaPrompt: isc.i18nMessages.advancedHiliteEditor_invalidCriteriaPrompt});
												}
												var shortDateFormat = isc.i18nMessages.date_shortDateFormat;
												if (shortDateFormat != null) isc.DateUtil.setShortDisplayFormat(shortDateFormat);
												var shortDatetimeFormat = isc.i18nMessages.date_shortDatetimeFormat;
												if (shortDatetimeFormat != null) isc.DateUtil.setShortDatetimeDisplayFormat(shortDatetimeFormat);
												var dateSeparator = isc.i18nMessages.date_dateSeparator;
												if (dateSeparator != null) isc.DateUtil.setDefaultDateSeparator(dateSeparator);
												var normalDateFormat = isc.i18nMessages.date_normalDateFormat;
												if (normalDateFormat != null) isc.DateUtil.setNormalDateDisplayFormat(normalDateFormat);
												var normalDatetimeFormat = isc.i18nMessages.date_normalDatetimeFormat;
												if (normalDatetimeFormat != null) isc.DateUtil.setNormalDatetimeDisplayFormat(normalDatetimeFormat);
												var inputFormat = isc.i18nMessages.date_inputFormat;
												if (inputFormat != null) isc.DateUtil.setInputFormat(inputFormat);
												if(isc.DateRangeItem) {
												    if(isc.i18nMessages.dateRangeItem_fromTitle) isc.DateRangeItem.addProperties({fromTitle: isc.i18nMessages.dateRangeItem_fromTitle});
												    if(isc.i18nMessages.dateRangeItem_toTitle) isc.DateRangeItem.addProperties({toTitle: isc.i18nMessages.dateRangeItem_toTitle});
												    if(isc.i18nMessages.dateRangeItem_invalidRangeErrorMessage) isc.DateRangeItem.addProperties({invalidRangeErrorMessage: isc.i18nMessages.dateRangeItem_invalidRangeErrorMessage});
												    if(isc.i18nMessages.dateRangeDialog_headerTitle) isc.DateRangeDialog.addProperties({headerTitle: isc.i18nMessages.dateRangeDialog_headerTitle});
												    if(isc.i18nMessages.dateRangeDialog_clearButtonTitle) isc.DateRangeDialog.addProperties({clearButtonTitle: isc.i18nMessages.dateRangeDialog_clearButtonTitle});
												    if(isc.i18nMessages.dateRangeDialog_okButtonTitle) isc.DateRangeDialog.addProperties({okButtonTitle: isc.i18nMessages.dateRangeDialog_okButtonTitle});
												    if(isc.i18nMessages.dateRangeDialog_cancelButtonTitle) isc.DateRangeDialog.addProperties({cancelButtonTitle: isc.i18nMessages.dateRangeDialog_cancelButtonTitle});
												    if(isc.i18nMessages.miniDateRangeItem_pickerIconPrompt) isc.MiniDateRangeItem.addProperties({pickerIconPrompt: isc.i18nMessages.miniDateRangeItem_pickerIconPrompt});
												    if(isc.i18nMessages.miniDateRangeItem_fromDateOnlyPrefix) isc.MiniDateRangeItem.addProperties({fromDateOnlyPrefix: isc.i18nMessages.miniDateRangeItem_fromDateOnlyPrefix});
												    if(isc.i18nMessages.miniDateRangeItem_toDateOnlyPrefix) isc.MiniDateRangeItem.addProperties({toDateOnlyPrefix: isc.i18nMessages.miniDateRangeItem_toDateOnlyPrefix});
												    if(isc.i18nMessages.relativeDateItem_todayTitle) isc.RelativeDateItem.addProperties({todayTitle: isc.i18nMessages.relativeDateItem_todayTitle});
												    if(isc.i18nMessages.relativeDateItem_millisecondsAgoTitle) isc.RelativeDateItem.addProperties({millisecondsAgoTitle: isc.i18nMessages.relativeDateItem_millisecondsAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_secondsAgoTitle) isc.RelativeDateItem.addProperties({secondsAgoTitle: isc.i18nMessages.relativeDateItem_secondsAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_minutesAgoTitle) isc.RelativeDateItem.addProperties({minutesAgoTitle: isc.i18nMessages.relativeDateItem_minutesAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_hoursAgoTitle) isc.RelativeDateItem.addProperties({hoursAgoTitle: isc.i18nMessages.relativeDateItem_hoursAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_daysAgoTitle) isc.RelativeDateItem.addProperties({daysAgoTitle: isc.i18nMessages.relativeDateItem_daysAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_weeksAgoTitle) isc.RelativeDateItem.addProperties({weeksAgoTitle: isc.i18nMessages.relativeDateItem_weeksAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_monthsAgoTitle) isc.RelativeDateItem.addProperties({monthsAgoTitle: isc.i18nMessages.relativeDateItem_monthsAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_quartersAgoTitle) isc.RelativeDateItem.addProperties({quartersAgoTitle: isc.i18nMessages.relativeDateItem_quartersAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_yearsAgoTitle) isc.RelativeDateItem.addProperties({yearsAgoTitle: isc.i18nMessages.relativeDateItem_yearsAgoTitle});
												    if(isc.i18nMessages.relativeDateItem_millisecondsFromNowTitle) isc.RelativeDateItem.addProperties({millisecondsFromNowTitle: isc.i18nMessages.relativeDateItem_millisecondsFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_secondsFromNowTitle) isc.RelativeDateItem.addProperties({secondsFromNowTitle: isc.i18nMessages.relativeDateItem_secondsFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_minutesFromNowTitle) isc.RelativeDateItem.addProperties({minutesFromNowTitle: isc.i18nMessages.relativeDateItem_minutesFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_hoursFromNowTitle) isc.RelativeDateItem.addProperties({hoursFromNowTitle: isc.i18nMessages.relativeDateItem_hoursFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_daysFromNowTitle) isc.RelativeDateItem.addProperties({daysFromNowTitle: isc.i18nMessages.relativeDateItem_daysFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_weeksFromNowTitle) isc.RelativeDateItem.addProperties({weeksFromNowTitle: isc.i18nMessages.relativeDateItem_weeksFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_monthsFromNowTitle) isc.RelativeDateItem.addProperties({monthsFromNowTitle: isc.i18nMessages.relativeDateItem_monthsFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_quartersFromNowTitle) isc.RelativeDateItem.addProperties({quartersFromNowTitle: isc.i18nMessages.relativeDateItem_quartersFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_yearsFromNowTitle) isc.RelativeDateItem.addProperties({yearsFromNowTitle: isc.i18nMessages.relativeDateItem_yearsFromNowTitle});
												    if(isc.i18nMessages.relativeDateItem_pickerIconPrompt) isc.RelativeDateItem.addProperties({pickerIconPrompt: isc.i18nMessages.relativeDateItem_pickerIconPrompt});
												    if(isc.i18nMessages.relativeDateItem_presetOptions_today) isc.RelativeDateItem.addProperties({presetOptions: {"$today" : isc.i18nMessages.relativeDateItem_presetOptions_today, "$yesterday" : isc.i18nMessages.relativeDateItem_presetOptions_yesterday, "$tomorrow" : isc.i18nMessages.relativeDateItem_presetOptions_tomorrow, "$weekAgo" : isc.i18nMessages.relativeDateItem_presetOptions_minus_1w, "$weekFromNow" : isc.i18nMessages.relativeDateItem_presetOptions_plus_1w, "$monthAgo" : isc.i18nMessages.relativeDateItem_presetOptions_minus_1m, "$monthFromNow" : isc.i18nMessages.relativeDateItem_presetOptions_plus_1m}});
												}
												if(isc.PickList) {
												    if(isc.i18nMessages.pickList_emptyPickListMessage) isc.PickList.addInterfaceProperties({emptyPickListMessage: isc.i18nMessages.pickList_emptyPickListMessage});
												}
												if(isc.SelectItem) {
												    if(isc.i18nMessages.selectItem_emptyPickListMessage) isc.SelectItem.addProperties({emptyPickListMessage: isc.i18nMessages.selectItem_emptyPickListMessage});
												    if(isc.i18nMessages.selectItem_pickerExitButtonTitle) isc.SelectItem.addProperties({pickerExitButtonTitle: isc.i18nMessages.selectItem_pickerExitButtonTitle});
												    if(isc.i18nMessages.selectItem_pickerClearButtonTitle) isc.SelectItem.addProperties({pickerClearButtonTitle: isc.i18nMessages.selectItem_pickerClearButtonTitle});
												}
												if(isc.ComboBoxItem) {
												    if(isc.i18nMessages.comboBoxItem_emptyPickListMessage) isc.ComboBoxItem.addProperties({emptyPickListMessage: isc.i18nMessages.comboBoxItem_emptyPickListMessage});
												    if(isc.i18nMessages.comboBoxItem_pickerSearchFieldHint) isc.ComboBoxItem.addProperties({pickerSearchFieldHint: isc.i18nMessages.comboBoxItem_pickerSearchFieldHint});
												    if(isc.i18nMessages.comboBoxItem_pickerExitButtonTitle) isc.ComboBoxItem.addProperties({pickerExitButtonTitle: isc.i18nMessages.comboBoxItem_pickerExitButtonTitle});
												    if(isc.i18nMessages.comboBoxItem_pickerSaveButtonTitle) isc.ComboBoxItem.addProperties({pickerSaveButtonTitle: isc.i18nMessages.comboBoxItem_pickerSaveButtonTitle});
												    if(isc.i18nMessages.comboBoxItem_pickerClearButtonTitle) isc.ComboBoxItem.addProperties({pickerClearButtonTitle: isc.i18nMessages.comboBoxItem_pickerClearButtonTitle});
												    if(isc.i18nMessages.comboBoxItem_searchStringTooShortMessage) isc.ComboBoxItem.addProperties({searchStringTooShortMessage: isc.i18nMessages.comboBoxItem_searchStringTooShortMessage});
												    if(isc.i18nMessages.comboBoxItem_pickerSearchOrNewValueFieldHint) isc.ComboBoxItem.addProperties({pickerSearchOrNewValueFieldHint: isc.i18nMessages.comboBoxItem_pickerSearchOrNewValueFieldHint});
												}
												if(isc.PickListMenu) {
												    if(isc.i18nMessages.pickListMenu_emptyMessage) isc.PickListMenu.addProperties({emptyMessage: isc.i18nMessages.pickListMenu_emptyMessage});
												}
												if(isc.Portlet) {
												    if(isc.i18nMessages.portlet_closeConfirmationMessage) isc.Portlet.addProperties({closeConfirmationMessage: isc.i18nMessages.portlet_closeConfirmationMessage});
												}
												if(isc.Menu) {
												    if(isc.i18nMessages.menu_emptyMessage) isc.Menu.addProperties({emptyMessage: isc.i18nMessages.menu_emptyMessage});
												    if(isc.i18nMessages.menu_cancelButtonTitle) isc.Menu.addProperties({cancelButtonTitle: isc.i18nMessages.menu_cancelButtonTitle});
												}
												if(isc.IMenuButton) {
												    if(isc.i18nMessages.iMenuButton_title) isc.IMenuButton.addProperties({title: isc.i18nMessages.iMenuButton_title});   
												}
												if(isc.PresetCriteriaItem) {
												    if(isc.i18nMessages.presetCriteriaItem_customOptionTitle) isc.PresetCriteriaItem.addProperties({customOptionTitle: isc.i18nMessages.presetCriteriaItem_customOptionTitle});   
												}
												if (isc.NumberUtil) {
												    if(isc.i18nMessages.numberUtil_currencySymbol ) isc.NumberUtil.addClassProperties({ currencySymbol: isc.i18nMessages.numberUtil_currencySymbol });
												    if(isc.i18nMessages.numberUtil_groupingSymbol ) isc.NumberUtil.addClassProperties({ groupingSymbol: isc.i18nMessages.numberUtil_groupingSymbol });
												    if(isc.i18nMessages.numberUtil_decimalSymbol ) isc.NumberUtil.addClassProperties({ decimalSymbol: isc.i18nMessages.numberUtil_decimalSymbol });
												    if(isc.i18nMessages.numberUtil_negativeSymbol ) isc.NumberUtil.addClassProperties({ negativeSymbol: isc.i18nMessages.numberUtil_negativeSymbol });
												}
												if(isc.TabSet) {
												    if(isc.i18nMessages.tabSet_ariaCloseableSuffix) isc.TabSet.addProperties({ariaCloseableSuffix: isc.i18nMessages.tabSet_ariaCloseableSuffix});
												}
												if(isc.SplitPane) {
												    if(isc.i18nMessages.splitPane_listPaneTitleTemplate) isc.SplitPane.addProperties({listPaneTitleTemplate: (isc.i18nMessages.splitPane_listPaneTitleTemplate).replace(/(\$titleField)/g, '${titleField}')});
												    if(isc.i18nMessages.splitPane_detailPaneTitleTemplate) isc.SplitPane.addProperties({detailPaneTitleTemplate: (isc.i18nMessages.splitPane_detailPaneTitleTemplate).replace(/(\$titleField)/g, '${titleField}')});
												}
												isc.addProperties(Date, {shortDayNames: [
												   isc.i18nMessages.date_shortDayNames_1,
												   isc.i18nMessages.date_shortDayNames_2,
												   isc.i18nMessages.date_shortDayNames_3,
												   isc.i18nMessages.date_shortDayNames_4,
												   isc.i18nMessages.date_shortDayNames_5,
												   isc.i18nMessages.date_shortDayNames_6,
												   isc.i18nMessages.date_shortDayNames_7
												]})
												isc.addProperties(Date, {dayNames: [
												   isc.i18nMessages.date_dayNames_1,
												   isc.i18nMessages.date_dayNames_2,
												   isc.i18nMessages.date_dayNames_3,
												   isc.i18nMessages.date_dayNames_4,
												   isc.i18nMessages.date_dayNames_5,
												   isc.i18nMessages.date_dayNames_6,
												   isc.i18nMessages.date_dayNames_7
												]})
												isc.addProperties(Date, {shortMonthNames: [
												   isc.i18nMessages.date_shortMonthNames_1,
												   isc.i18nMessages.date_shortMonthNames_2,
												   isc.i18nMessages.date_shortMonthNames_3,
												   isc.i18nMessages.date_shortMonthNames_4,
												   isc.i18nMessages.date_shortMonthNames_5,
												   isc.i18nMessages.date_shortMonthNames_6,
												   isc.i18nMessages.date_shortMonthNames_7,
												   isc.i18nMessages.date_shortMonthNames_8,
												   isc.i18nMessages.date_shortMonthNames_9,
												   isc.i18nMessages.date_shortMonthNames_10,
												   isc.i18nMessages.date_shortMonthNames_11,
												   isc.i18nMessages.date_shortMonthNames_12
												]})
												isc.addProperties(Date, {monthNames: [
												   isc.i18nMessages.date_monthNames_1,
												   isc.i18nMessages.date_monthNames_2,
												   isc.i18nMessages.date_monthNames_3,
												   isc.i18nMessages.date_monthNames_4,
												   isc.i18nMessages.date_monthNames_5,
												   isc.i18nMessages.date_monthNames_6,
												   isc.i18nMessages.date_monthNames_7,
												   isc.i18nMessages.date_monthNames_8,
												   isc.i18nMessages.date_monthNames_9,
												   isc.i18nMessages.date_monthNames_10,
												   isc.i18nMessages.date_monthNames_11,
												   isc.i18nMessages.date_monthNames_12
												]})
												if (cbk) cbk(lc, auth);
											});

						} else {
							if (cbk) cbk(lc, auth);
						}
					}
				});
