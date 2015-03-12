'use strict'

angular.module('not-flux')
  .service('Action', ['$rootScope', ($rootScope) => {
    /**
     * Representation of a action that we use to trigger store events
     * @class
     * @param {string} actionName - The action name
     * @returns An callback representing that action
     **/
    return class Action {
      /**
       * Create a bunch of new actions usign an array
       * @func
       * @param {array} actionList - An array of actionNames to create
       * @returns A object with actions
       **/
      static createFromList(actionList) {
        if (!angular.isArray(actionList)) throw new Error('You must pass actions an array')

        let functionSet = {}

        actionList.forEach(action => {
          functionSet[action] = new Action(action)
        })

        return functionSet
      }

      constructor(actionName) {
        var newAction   = this.callAction.bind(this)
        this.name       = actionName
        this._listeners = []

        newAction.listenTo = this.listenTo.bind(this)

        return newAction
      }

      /**
       * Add a callback as a listener to an action
       * @func
       * @param {function} callback - A single callback or an array of callbacks
       **/
      listenTo(callback) {
        this._listeners = this._listeners.concat(callback)
      }

      callAction(...args) {
        if (!this._listeners.length) throw new Error('You action has nothing listening to it! Make sure to load it up first')

        this._listeners.forEach(listener => listener.apply(this, args))
      }
    }
  }])