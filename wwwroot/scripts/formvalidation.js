function SetAriaDescribedBy(formErrorFields) {
    if (formErrorFields !== '') {
        // add aria-describedby to errored fields. "valmsg_" is added in RenderField()
        let arrFormErrorFields = formErrorFields.split(",");
        for (let i = 0; i < arrFormErrorFields.length; i++) {
            let fldId = arrFormErrorFields[i];
            let fld = document.getElementById(`${fldId}`);
            if (fld != null) {
                let valmsgFld = document.querySelector(`#valmsg_${fldId}`);
                if (valmsgFld != null) {
                    fld.setAttribute('aria-describedby', `valmsg_${fldId}`);
                }
            }
        }
    }
}

function SetFocusFirstErrField() {
    // set focus to first errored field. only difference between errored input and non-errored is existence of
    // of aria-describedby attribute. need to look for that, otherwise you might set focus to perfectly valid field
    let errorElements = document.querySelectorAll('.umbraco-forms-field-wrapper input[aria-describedby], .umbraco-forms-field-wrapper select[aria-describedby], .umbraco-forms-field-wrapper textarea[aria-describedby]');
    if (errorElements.length > 0) {
        let first = errorElements[0];
        first.focus();
    }
}
