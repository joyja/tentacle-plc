export const state = () => {
  return {
    values: [],
    configuration: {},
    metrics: [],
    programs: [],
    classes: [],
    variables: [],
    plc: {},
    changes: [],
  }
}

export const getters = {
  serverHost: () => process.env.TENTACLE_SERVER_HOST || 'localhost',
  serverProtocol: () => process.env.TENTACLE_SERVER_PROTOCOL || 'http',
  serverPort: () => process.env.TENTACLE_SERVER_PORT || 4000,
  serverUrl: () => process.env.TENTACLE_SERVER_URL || '/',
  clientHost: () => process.env.TENTACLE_CLIENT_HOST || process.client ? window.location.hostname : '',
  clientProtocol: () => process.env.TENTACLE_CLIENT_PROTOCOL || 'http',
  clientPort: () => process.env.TENTACLE_CLIENT_PORT || 4000,
  clientUrl: () => process.env.TENTACLE_CLIENT_URL || '/',
  endpoint (state, getters) {
    if (process.client) {
      return `${getters.clientProtocol}://${getters.clientHost}:${getters.clientPort}${getters.clientUrl}`
    } else {
      return `${getters.serverProtocol}://${getters.serverHost}:${getters.serverPort}${getters.serverUrl}`
    }
  },
  codes(state, getters) {
    return [
      ...Object.keys(state.programs).map((key) => {
        return {
          name: key,
          type: 'program',
          ...state.programs[key],
        }
      }),
      ...Object.keys(state.classes).map((key) => {
        return {
          name: key,
          type: 'class',
          ...state.classes[key],
        }
      })
    ]
  },
  variablesDetailed: (state) => {
    return state.variables.map((variable) => {
      const atomicTypes = ['string', 'boolean', 'number']
      const contextParams = {}
      if (atomicTypes.includes(variable.datatype)) {
        const value = state.values.find((value) => value.path === variable.name)
        if (value) {
          if (value.datatype === 'string' && value.value.includes('function')) {
            contextParams.datatype = 'function'
            contextParams.argumentCount = parseInt(value.value.replace('function',''))
          } else {
            contextParams.datatype = value.datatype
            contextParams.value = value.value
          }
        }
        contextParams.path = value.path
      } else {
        const children = variable.children.map((child) => {
          const value = state.values.find((value) => value.path === `${variable.name}.${child.name}`).value
          return {
            ...child,
            value
          }
        })
        const values = state.values
          .filter((value) => value.path.split('.')[0] === variable.name)
          .map((value) => {
            const child = children.find((child) => child.name === value.path.split('.').slice(1).join('.')) || {} 
            return {
              name: value.path.split('.').slice(1).join('.'),
              path: value.path,
              datatype: child.datatype ? child.datatype : value.datatype,
              value: value.value,
              ...child
            }
          })
        contextParams.values = values
      }
      return {
        ...variable,
        ...contextParams,
      }
    }) 
  },
  // codeMotor: await queryClass('motor.js'),
  // variables: await queryVariables(),
}

export const mutations = {
  setState(state, { key, moduleName, value }) {
    if (key) {
      if (!moduleName) {
        state[key] = value
      } else {
        state[moduleName][key] = value
      }
    } else {
      throw new Error('You need to specify a state key to use setState.')
    }
  },
  setCodeState(state, { codeName, codeType, key, value }) {
    if (codeType === 'program') {
      state.programs[codeName][key] = value
    } else {
      state.classes[codeName][key] = value
    }
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('fetchPLC')
    await dispatch('fetchConfig')
    await dispatch('fetchPrograms')
    await dispatch('fetchClasses')
    await dispatch('fetchVariables')
    await dispatch('fetchValues')
    await dispatch('fetchMetrics')
    await dispatch('fetchChanges')
  },
  fetchChanges({ dispatch }) {
    return dispatch('fetchFromPLC', { stateKey: 'changes', queryName: 'changes', query: `query Changes {
      changes {
        path
        event
      }
    }`})
  },
  fetchPLC({ dispatch }) {
    return dispatch('fetchFromPLC', { stateKey: 'plc', queryName: 'plc', query: `query Plc {
      plc {
        running
      }
    }`})
  },
  fetchValues({ dispatch }) {
     return dispatch('fetchFromPLC', { stateKey: 'values', queryName: 'values', query: `query Values {
       values {
         path
         value
         datatype
       }
     }`})
  },
  fetchVariables({dispatch}) {
    return dispatch('fetchFromPLC',{ stateKey: 'variables', queryName:'variables', query: `query Variables {
    variables {
      name
      description
      datatype
      initialValue
      persistent
      children{
        name
        description
        datatype
        initialValue
        persistent
      }
      source {
        name
        type
        rate
        params {
          register
        }
      }
    }
  }`})
  },
  fetchConfig({dispatch}) {
    return dispatch('fetchFromPLC',{ queryName: 'configuration', stateKey:  'configuration', query: `query Configuration {
        configuration {
          tasks {
            name
            description
            scanRate
            program
          }
          mqtt {
            name
            description
            config {
              serverUrl
            }
          }
          modbus {
            name
            description
            config {
              host
              port
            }
          }
        }
      }`})
  },
  fetchMetrics({dispatch}) {
      return dispatch('fetchFromPLC',{ stateKey: 'metrics', queryName:'metrics', query:`query Metrics {
        metrics {
          task
          functionExecutionTime,
          intervalExecutionTime,
          totalScanTime
        }
      }`})
  },
  fetchPrograms({dispatch}) {
    return dispatch('fetchFromPLC',{ 
      operation: (result) => {
        return result.reduce((acc, program) => {
          return {
            ...acc,
            [program]: {
              visible: false,
              loading: false,
              code: ''
            }
          }
        },{})
      },
      stateKey: 'programs', 
      queryName:'programs', 
      query: `query Programs {
        programs
    }`})
  },
  fetchClasses({dispatch}) {
    return dispatch('fetchFromPLC',{ 
      operation: (result) => {
        return result.reduce((acc, cls) => {
          return {
            ...acc,
            [cls]: {
              visible: false,
              loading: false,
              code: ''
            }
          }
        },{})
      },
      stateKey: 'classes', 
      queryName:'classes', 
      query: `query Classes {
        classes
    }`})
  },
  fetchProgram({commit, dispatch}, selector) {
    commit('setCodeState', {
      codeName: selector,
      codeType: 'program',
      key: 'loading',
      value: true
    })
    return dispatch('fetchFromPLC',{
      operation: (result) => {
        commit('setCodeState', {
          codeName: selector,
          codeType: 'program',
          key: 'loading',
          value: false
        })
        return result
      },
      mutationName: 'setCodeState',
      mutationProps: {
        codeName: selector,
        codeType: 'program',
        key: 'code',
      },
      queryName:'program', 
      query: `query Program {
        program(name: "${selector}")
    }`})
  },
  fetchClass({commit, dispatch}, selector) {
    commit('setCodeState', {
      codeName: selector,
      codeType: 'class',
      key: 'loading',
      value: true
    })
    return dispatch('fetchFromPLC',{ 
      operation: (result) => {
        commit('setCodeState', {
          codeName: selector,
          codeType: 'class',
          key: 'loading',
          value: false
        })
        return result
      },
      mutationName: 'setCodeState',
      mutationProps: {
        codeName: selector,
        codeType: 'class',
        key: 'code',
      },
      queryName:'class', 
      query: `query Class {
        class(name: "${selector}")
    }`})
  },
  setValue({dispatch}, { variablePath, value }) {
    return dispatch('fetchFromPLC',{ stateKey: 'setValue', queryName:'setValue', query: `mutation SetValue {
      setValue(
        variablePath: "${variablePath}"
        value: "${value}"
      ) {
        path
        value
        datatype
      }
    }`})
  },
  runFunction({dispatch},functionPath, args) {
    return dispatch('fetchFromPLC', { stateKey: 'runFunction', queryName: 'runFunction', query: `mutation RunFunction {
      runFunction(
        functionPath: "${functionPath}"
        args: "${JSON.stringify(args)}"
      )
    }`})
  },
  startPLC({ dispatch }) {
    return dispatch('fetchFromPLC', { stateKey: 'plc', queryName: 'startPlc', query: `mutation StartPlc {
      startPlc {
        running
      }
    }`})
  },
  stopPLC({ dispatch }) {
    return dispatch('fetchFromPLC', { stateKey: 'plc', queryName: 'stopPlc', query: `mutation StopPlc {
      stopPlc {
        running
      }
    }`})
  },
  async restartPLC({ dispatch }) {
    await dispatch('fetchFromPLC', { stateKey: 'plc', queryName: 'restartPlc', query: `mutation RestartPlc {
      restartPlc {
        running
      }
    }`})
    setTimeout(async () => {
      await dispatch('fetchPLC')
      await dispatch('fetchConfig')
      await dispatch('fetchPrograms')
      await dispatch('fetchClasses')
      await dispatch('fetchVariables')
      await dispatch('fetchValues')
      await dispatch('fetchMetrics')
      await dispatch('fetchChanges')
    },5000)
  },
  async fetchFromPLC({ state, commit, getters }, { 
    mutationName, 
    mutationProps, 
    stateKey, 
    queryName, 
    query, 
    operation 
  }){
    const result = await fetch(getters.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        return data.data[queryName]
      })
    let value
    if (operation) {
      value = operation(result)
    } else {
      value = result
    }
    if (mutationName) {
      commit(mutationName, { ...mutationProps, value })
    } else {
      commit('setState', { key: stateKey, value }) 
    }
  },
  toggleCodeVisible({ state, commit, dispatch }, { codeName, codeType }) {
    if (codeType === 'program') {
      if (state.programs[codeName].visible) {
        commit('setCodeState', { 
          codeName, 
          codeType, 
          key:'visible', 
          value:false 
        })
      } else {
        commit('setCodeState', { 
          codeName, 
          codeType, 
          key:'visible', 
          value:true
        })
        dispatch('fetchProgram', codeName)
      }
    } else if (codeType === 'class') {
      if (state.classes[codeName].visible) {
        commit('setCodeState', { 
          codeName, 
          codeType, 
          key:'visible', 
          value:false 
        })
      } else {
        commit('setCodeState', { 
          codeName, 
          codeType, 
          key:'visible', 
          value:true 
        })
        dispatch('fetchClass', codeName)
      }
    }
  },
}