const numberUnit = {
  namespace: 'number',
  state: {
    num: 0
  },
  reducers: {
    add(state, { payload, type }) {
      return {
        num: state.num + payload
      };
    },
    getNum(state, action) {
      return {
        num: state.num
      };
    }
  },
  effects: {
    async addAsync({ type, payload: value }, { dispatch, getState, pick, save }) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
        .then(response => {
          const prevNum = pick('num');
          const otherName = pick('name', 'user');
          console.log(prevNum, otherName);
          dispatch({
            // @todo 该位置的type只能取字符串
            type: 'number/add',
            payload: value + Math.floor(prevNum / 2)
          });
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    },
    async saveAsync(action, { dispatch, getState, pick, save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum });
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};

const userUnit = {
  namespace: 'user',
  state: {
    name: 'zhangsan'
  },
  reducers: {
    modify(state, { payload }) {
      if (!payload) return state;
      const { name } = payload;
      return {
        name
      };
    }
  },

  effects: {
    async saveOther(action, { dispatch, getState, pick, save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum + pick('num', 'number') }, 'number');
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};

export function registerUnit(genji) {
  const numberUnitTypes = genji.model(numberUnit);
  const userUnitTypes = genji.model(userUnit);
  return { numberUnit: numberUnitTypes, userUnit: userUnitTypes };
}
