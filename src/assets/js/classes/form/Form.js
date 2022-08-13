class Form {
    #formId = ''
    #formErrorContainerId = ''

    /**
     *
     */
    formFieldMonitor() {}

    /**
     *
     * @param rules
     */
    isValid(rules) {}

    /**
     *
     * @param formId
     * @param formErrorContainerId
     * @param validationRules
     */
    register (formId, formErrorContainerId, validationRules) {
        this.#formId = formId
        this.#formErrorContainerId = formErrorContainerId

        // initialize link form
        this.formFieldMonitor()

        // check is valid and display form button send
        if (this.isValid(validationRules)) {
            // display button
        }
    }
}

export export default
