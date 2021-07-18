exports.reduxConfig = (data) => {
  const dirPath = `${__dirname}/../../../redux`
  const reduxTemplates = `${__dirname}/../templates/redux`
  let actions = [
    {
      type: 'append',
      path: `${dirPath}/actions/types.js`,
      templateFile: `${reduxTemplates}/actionTypes.js.hbs`,
    },
  ]
  let actionPath = `${dirPath}/actions/{{camelCase action_prefix}}Actions.js`

  if (data.createOrModify === 'create') {
    actions = [
      ...actions,
      {
        type: 'add',
        path: actionPath,
        templateFile: `${reduxTemplates}/create/actions.js.hbs`,
      },
    ]

    // Create reducer
    if (data.reducerConfirm) {
      actions = [
        ...actions,
        {
          type: 'add',
          path: `${dirPath}/reducers/{{camelCase action_prefix}}Reducer.js`,
          templateFile: `${reduxTemplates}/create/reducer.js.hbs`,
        },
        // Add new reducer to the root reducer
        {
          type: 'modify',
          path: `${dirPath}/reducers/rootReducer.js`,
          pattern: /\/\/ plopImport/,
          templateFile: `${reduxTemplates}/create/rootReducer.js.hbs`,
        },
        {
          type: 'modify',
          path: `${dirPath}/reducers/rootReducer.js`,
          pattern: /\/\/ plopReducer/,
          template: '{{action_prefix}},\n//plopReducer',
        },
      ]
    }
  }
  if (data.createOrModify === 'modify') {
    actionPath = `${dirPath}/actions/{{camelCase action}}.js`
    const reducerPath = `${dirPath}/reducers/{{reducer_name}}.js`
    const actionType = 'append'
    actions = [
      ...actions,
      {
        type: actionType,
        path: actionPath,
        pattern: /import {/,
        templateFile: `${reduxTemplates}/modify/actionImports.js.hbs`,
      },
      {
        type: actionType,
        path: actionPath,
        templateFile: `${reduxTemplates}/modify/actions.js.hbs`,
      },
    ]

    if (data.reducerConfirm) {
      actions = [
        ...actions,
        {
          type: actionType,
          path: reducerPath,
          pattern: /import {/,
          templateFile: `${reduxTemplates}/modify/actionImports.js.hbs`,
        },
        {
          type: 'modify',
          path: reducerPath,
          pattern: /\/\/plopImport/,
          templateFile: `${reduxTemplates}/modify/reducer.js.hbs`,
        },
      ]
    }
  }

  return actions
}
